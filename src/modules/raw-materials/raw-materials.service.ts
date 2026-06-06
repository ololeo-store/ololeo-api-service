import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRawMaterialDto, UpdateRawMaterialDto } from './dto/raw-material.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class RawMaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRawMaterialDto) {
    return this.prisma.raw_materials.create({
      data: {
        id: randomUUID(),
        name: dto.name,
        stock: dto.stock ?? 0,
        unit: dto.unit,
        price_per_unit: dto.price_per_unit ?? 0,
        updated_at: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.raw_materials.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const material = await this.prisma.raw_materials.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Raw material with ID '${id}' not found`);
    }

    return material;
  }

  async update(id: string, dto: UpdateRawMaterialDto) {
    const material = await this.findOne(id);

    return this.prisma.raw_materials.update({
      where: { id },
      data: {
        name: dto.name ?? material.name,
        stock: dto.stock ?? material.stock,
        unit: dto.unit ?? material.unit,
        price_per_unit: dto.price_per_unit ?? material.price_per_unit,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.raw_materials.delete({
      where: { id },
    });
  }
}
