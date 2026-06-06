import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    // 1. Verify product if product_id is provided
    if (dto.product_id) {
      const product = await this.prisma.products.findUnique({
        where: { id: dto.product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
      }
    }

    // 2. Verify user if user_id is provided
    if (dto.user_id) {
      const user = await this.prisma.users.findUnique({
        where: { id: dto.user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID '${dto.user_id}' not found`);
      }
    }

    return this.prisma.reviews.create({
      data: {
        id: randomUUID(),
        product_id: dto.product_id,
        user_id: dto.user_id,
        customer_name: dto.customer_name,
        rating: dto.rating,
        comment: dto.comment,
        is_approved: dto.is_approved ?? false,
      },
      include: {
        products: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.reviews.findMany({
      include: {
        products: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.reviews.findUnique({
      where: { id },
      include: {
        products: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID '${id}' not found`);
    }

    return review;
  }

  async update(id: string, dto: UpdateReviewDto) {
    const review = await this.findOne(id);

    // 1. Verify product if updated
    if (dto.product_id && dto.product_id !== review.product_id) {
      const product = await this.prisma.products.findUnique({
        where: { id: dto.product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
      }
    }

    // 2. Verify user if updated
    if (dto.user_id && dto.user_id !== review.user_id) {
      const user = await this.prisma.users.findUnique({
        where: { id: dto.user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID '${dto.user_id}' not found`);
      }
    }

    return this.prisma.reviews.update({
      where: { id },
      data: {
        product_id: dto.product_id !== undefined ? dto.product_id : review.product_id,
        user_id: dto.user_id !== undefined ? dto.user_id : review.user_id,
        customer_name: dto.customer_name ?? review.customer_name,
        rating: dto.rating ?? review.rating,
        comment: dto.comment !== undefined ? dto.comment : review.comment,
        is_approved: dto.is_approved ?? review.is_approved,
      },
      include: {
        products: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reviews.delete({
      where: { id },
    });
  }
}
