import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStoreSettingDto, UpdateStoreSettingDto } from './dto/store-setting.dto.js';

@Injectable()
export class StoreSettingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStoreSettingDto) {
    const existing = await this.prisma.store_settings.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Store setting with key '${dto.key}' already exists`);
    }

    return this.prisma.store_settings.create({
      data: {
        key: dto.key,
        value: dto.value,
        updated_at: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.store_settings.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async findOne(key: string) {
    const setting = await this.prisma.store_settings.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Store setting with key '${key}' not found`);
    }

    return setting;
  }

  async update(key: string, dto: UpdateStoreSettingDto) {
    await this.findOne(key);

    return this.prisma.store_settings.update({
      where: { key },
      data: {
        value: dto.value,
        updated_at: new Date(),
      },
    });
  }

  async remove(key: string) {
    await this.findOne(key);

    return this.prisma.store_settings.delete({
      where: { key },
    });
  }
}
