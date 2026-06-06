import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDiscountDto) {
    const product = await this.prisma.products.findUnique({
      where: { id: dto.product_id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
    }

    return this.prisma.discounts.create({
      data: {
        id: randomUUID(),
        product_id: dto.product_id,
        discount_type: dto.discount_type,
        value: dto.value,
        start_time: new Date(dto.start_time),
        end_time: new Date(dto.end_time),
        is_active: dto.is_active ?? true,
        updated_at: new Date(),
      },
      include: {
        products: true,
      },
    });
  }

  async findAll() {
    return this.prisma.discounts.findMany({
      include: {
        products: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const discount = await this.prisma.discounts.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!discount) {
      throw new NotFoundException(`Discount with ID '${id}' not found`);
    }
    return discount;
  }

  async update(id: string, dto: UpdateDiscountDto) {
    const discount = await this.findOne(id);

    if (dto.product_id && dto.product_id !== discount.product_id) {
      const product = await this.prisma.products.findUnique({
        where: { id: dto.product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
      }
    }

    return this.prisma.discounts.update({
      where: { id },
      data: {
        product_id: dto.product_id ?? discount.product_id,
        discount_type: dto.discount_type ?? discount.discount_type,
        value: dto.value ?? discount.value,
        start_time: dto.start_time ? new Date(dto.start_time) : discount.start_time,
        end_time: dto.end_time ? new Date(dto.end_time) : discount.end_time,
        is_active: dto.is_active ?? discount.is_active,
        updated_at: new Date(),
      },
      include: {
        products: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.discounts.delete({
      where: { id },
    });
  }
}
