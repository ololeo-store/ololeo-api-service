import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery-item.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class GalleryItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGalleryItemDto) {
    // 1. Verify product if product_id is provided
    if (dto.product_id) {
      const product = await this.prisma.products.findUnique({
        where: { id: dto.product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
      }
    }

    return this.prisma.gallery_items.create({
      data: {
        id: randomUUID(),
        product_id: dto.product_id,
        image_url: dto.image_url,
        caption: dto.caption,
      },
      include: {
        products: true,
      },
    });
  }

  async findAll() {
    return this.prisma.gallery_items.findMany({
      include: {
        products: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const galleryItem = await this.prisma.gallery_items.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!galleryItem) {
      throw new NotFoundException(`Gallery Item with ID '${id}' not found`);
    }

    return galleryItem;
  }

  async update(id: string, dto: UpdateGalleryItemDto) {
    const galleryItem = await this.findOne(id);

    // 1. Verify product if updated
    if (dto.product_id && dto.product_id !== galleryItem.product_id) {
      const product = await this.prisma.products.findUnique({
        where: { id: dto.product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID '${dto.product_id}' not found`);
      }
    }

    return this.prisma.gallery_items.update({
      where: { id },
      data: {
        product_id: dto.product_id !== undefined ? dto.product_id : galleryItem.product_id,
        image_url: dto.image_url ?? galleryItem.image_url,
        caption: dto.caption !== undefined ? dto.caption : galleryItem.caption,
      },
      include: {
        products: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.gallery_items.delete({
      where: { id },
    });
  }
}
