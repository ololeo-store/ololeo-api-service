import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  async create(dto: CreateProductDto) {
    // 1. Verify category exists
    const category = await this.prisma.categories.findUnique({
      where: { id: dto.category_id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${dto.category_id}' not found`);
    }

    // 2. Generate and check slug
    const slug = this.slugify(dto.name);
    const existingProduct = await this.prisma.products.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new ConflictException(`Product with slug '${slug}' already exists`);
    }

    return this.prisma.products.create({
      data: {
        id: randomUUID(),
        category_id: dto.category_id,
        name: dto.name,
        slug,
        price: dto.price,
        discount_price: dto.discount_price,
        image_url: dto.image_url,
        description: dto.description,
        stock: dto.stock,
        is_active: dto.is_active ?? true,
        updated_at: new Date(),
      },
      include: {
        categories: true,
      },
    });
  }

  async findAll() {
    return this.prisma.products.findMany({
      include: {
        categories: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    // 1. Verify category if updated
    if (dto.category_id && dto.category_id !== product.category_id) {
      const category = await this.prisma.categories.findUnique({
        where: { id: dto.category_id },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID '${dto.category_id}' not found`);
      }
    }

    // 2. Handle slug if name is updated
    let slug = product.slug;
    if (dto.name && dto.name !== product.name) {
      slug = this.slugify(dto.name);
      const existingProduct = await this.prisma.products.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existingProduct) {
        throw new ConflictException(`Product with slug '${slug}' already exists`);
      }
    }

    return this.prisma.products.update({
      where: { id },
      data: {
        category_id: dto.category_id ?? product.category_id,
        name: dto.name ?? product.name,
        slug,
        price: dto.price ?? product.price,
        discount_price: dto.discount_price !== undefined ? dto.discount_price : product.discount_price,
        image_url: dto.image_url !== undefined ? dto.image_url : product.image_url,
        description: dto.description !== undefined ? dto.description : product.description,
        stock: dto.stock ?? product.stock,
        is_active: dto.is_active ?? product.is_active,
        updated_at: new Date(),
      },
      include: {
        categories: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.products.delete({
      where: { id },
    });
  }
}
