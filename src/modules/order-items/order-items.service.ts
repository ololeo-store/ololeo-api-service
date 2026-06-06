import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderItemDto) {
    // 1. Verify order exists
    const order = await this.prisma.orders.findUnique({
      where: { id: dto.order_id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID '${dto.order_id}' not found`);
    }

    // 2. Verify product exists
    const product = await this.prisma.products.findUnique({
      where: { id: dto.product_id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
    }

    const priceAtOrder = dto.price_at_order ?? product.price;

    return this.prisma.order_items.create({
      data: {
        id: randomUUID(),
        order_id: dto.order_id,
        product_id: dto.product_id,
        quantity: dto.quantity,
        price_at_order: priceAtOrder,
      },
      include: {
        orders: true,
        products: true,
      },
    });
  }

  async findAll() {
    return this.prisma.order_items.findMany({
      include: {
        orders: true,
        products: true,
      },
    });
  }

  async findOne(id: string) {
    const orderItem = await this.prisma.order_items.findUnique({
      where: { id },
      include: {
        orders: true,
        products: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order Item with ID '${id}' not found`);
    }

    return orderItem;
  }

  async update(id: string, dto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);

    // 1. Verify order if updated
    if (dto.order_id && dto.order_id !== orderItem.order_id) {
      const order = await this.prisma.orders.findUnique({
        where: { id: dto.order_id },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID '${dto.order_id}' not found`);
      }
    }

    // 2. Verify product if updated
    if (dto.product_id && dto.product_id !== orderItem.product_id) {
      const product = await this.prisma.products.findUnique({
        where: { id: dto.product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
      }
    }

    return this.prisma.order_items.update({
      where: { id },
      data: {
        order_id: dto.order_id ?? orderItem.order_id,
        product_id: dto.product_id ?? orderItem.product_id,
        quantity: dto.quantity ?? orderItem.quantity,
        price_at_order: dto.price_at_order ?? orderItem.price_at_order,
      },
      include: {
        orders: true,
        products: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.order_items.delete({
      where: { id },
    });
  }
}
