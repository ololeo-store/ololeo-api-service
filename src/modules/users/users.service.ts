import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    phone_number: true,
    role: true,
    created_at: true,
    updated_at: true,
  };

  async create(dto: CreateUserDto) {
    // 1. Verify email uniqueness if provided
    if (dto.email) {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException(`User with email '${dto.email}' already exists`);
      }
    }

    // 2. Hash password if provided
    let passwordHash: string | null = null;
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(dto.password, salt);
    }

    return this.prisma.users.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        password_hash: passwordHash,
        name: dto.name,
        phone_number: dto.phone_number,
        role: dto.role ?? 'customer',
        updated_at: new Date(),
      },
      select: this.userSelect,
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: this.userSelect,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    // 1. Verify email uniqueness if updated
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException(`User with email '${dto.email}' already exists`);
      }
    }

    // 2. Hash password if updated
    let passwordHash = user.password_hash;
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(dto.password, salt);
    }

    return this.prisma.users.update({
      where: { id },
      data: {
        email: dto.email ?? user.email,
        password_hash: passwordHash,
        name: dto.name ?? user.name,
        phone_number: dto.phone_number ?? user.phone_number,
        role: dto.role ?? user.role,
        updated_at: new Date(),
      },
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    // Check if user exists
    await this.findOne(id);

    return this.prisma.users.delete({
      where: { id },
      select: this.userSelect,
    });
  }
}
