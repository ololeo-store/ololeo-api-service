import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoriesService {
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

  async create(dto: CreateCategoryDto) {
    const slug = this.slugify(dto.name);

    const existingCategory = await this.prisma.categories.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    return this.prisma.categories.create({
      data: {
        id: randomUUID(),
        name: dto.name,
        slug,
        description: dto.description,
        updated_at: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.categories.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    let slug = category.slug;
    if (dto.name) {
      slug = this.slugify(dto.name);
      const existingCategory = await this.prisma.categories.findFirst({
        where: { slug, NOT: { id } },
      });

      if (existingCategory) {
        throw new ConflictException(`Category with slug '${slug}' already exists`);
      }
    }

    return this.prisma.categories.update({
      where: { id },
      data: {
        name: dto.name ?? category.name,
        slug,
        description: dto.description !== undefined ? dto.description : category.description,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.categories.delete({
      where: { id },
    });
  }
}
