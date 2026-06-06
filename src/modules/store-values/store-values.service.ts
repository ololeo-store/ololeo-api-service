import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStoreValueDto, UpdateStoreValueDto } from './dto/store-value.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class StoreValuesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStoreValueDto) {
    return this.prisma.store_values.create({
      data: {
        id: randomUUID(),
        title: dto.title,
        icon_name: dto.icon_name,
        content: dto.content,
        order_index: dto.order_index,
      },
    });
  }

  async findAll() {
    return this.prisma.store_values.findMany({
      orderBy: { order_index: 'asc' },
    });
  }

  async findOne(id: string) {
    const storeValue = await this.prisma.store_values.findUnique({
      where: { id },
    });

    if (!storeValue) {
      throw new NotFoundException(`Store value with ID '${id}' not found`);
    }

    return storeValue;
  }

  async update(id: string, dto: UpdateStoreValueDto) {
    const storeValue = await this.findOne(id);

    return this.prisma.store_values.update({
      where: { id },
      data: {
        title: dto.title ?? storeValue.title,
        icon_name: dto.icon_name ?? storeValue.icon_name,
        content: dto.content ?? storeValue.content,
        order_index: dto.order_index ?? storeValue.order_index,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.store_values.delete({
      where: { id },
    });
  }
}
