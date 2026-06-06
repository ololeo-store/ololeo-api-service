import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto.js';
import { randomUUID } from 'crypto';

interface ResolvedOrderItem {
  product_id: string;
  quantity: number;
  price_at_order: number;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // 1. Verify customer if customer_id is provided
    if (dto.customer_id) {
      const customer = await this.prisma.users.findUnique({
        where: { id: dto.customer_id },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID '${dto.customer_id}' not found`);
      }
    }

    // 2. Validate items and calculate total price
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const resolvedItems: ResolvedOrderItem[] = [];
    let totalPrice = 0;

    for (const item of dto.items) {
      const product = await this.prisma.products.findUnique({
        where: { id: item.product_id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID '${item.product_id}' not found`);
      }

      if (!product.is_active) {
        throw new BadRequestException(`Product '${product.name}' is currently inactive`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      const itemTotalPrice = product.price * item.quantity;
      totalPrice += itemTotalPrice;

      resolvedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: product.price,
      });
    }

    const orderId = randomUUID();

    // 3. Database transaction to create order, create order items, and deduct stock
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          id: orderId,
          customer_id: dto.customer_id,
          customer: dto.customer as any,
          pickup_date: new Date(dto.pickup_date),
          notes: dto.notes,
          total_price: totalPrice,
          status: 'pending',
          payment_status: 'unpaid',
          updated_at: new Date(),
        },
      });

      for (const item of resolvedItems) {
        // Create order item
        await tx.order_items.create({
          data: {
            id: randomUUID(),
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_order: item.price_at_order,
          },
        });

        // Deduct stock from product
        await tx.products.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
            updated_at: new Date(),
          },
        });
      }

      return tx.orders.findUnique({
        where: { id: orderId },
        include: {
          order_items: {
            include: {
              products: true,
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.orders.findMany({
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    return this.prisma.orders.update({
      where: { id },
      data: {
        status: dto.status ?? order.status,
        payment_status: dto.payment_status ?? order.payment_status,
        payment_token: dto.payment_token ?? order.payment_token,
        payment_url: dto.payment_url ?? order.payment_url,
        updated_at: new Date(),
      },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete associated order items first
      await tx.order_items.deleteMany({
        where: { order_id: id },
      });

      // 2. Delete the order itself
      return tx.orders.delete({
        where: { id },
      });
    });
  }
}
