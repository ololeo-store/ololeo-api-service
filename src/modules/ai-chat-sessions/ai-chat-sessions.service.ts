import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAiChatSessionDto, UpdateAiChatSessionDto } from './dto/ai-chat-session.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class AiChatSessionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAiChatSessionDto) {
    if (dto.user_id) {
      const user = await this.prisma.users.findUnique({
        where: { id: dto.user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID '${dto.user_id}' not found`);
      }
    }

    return this.prisma.ai_chat_sessions.create({
      data: {
        id: randomUUID(),
        user_id: dto.user_id,
        platform: dto.platform,
        external_session_id: dto.external_session_id,
        last_intent: dto.last_intent,
        updated_at: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.ai_chat_sessions.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.ai_chat_sessions.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        ai_chat_messages: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`AI Chat Session with ID '${id}' not found`);
    }

    return session;
  }

  async update(id: string, dto: UpdateAiChatSessionDto) {
    const session = await this.findOne(id);

    if (dto.user_id && dto.user_id !== session.user_id) {
      const user = await this.prisma.users.findUnique({
        where: { id: dto.user_id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID '${dto.user_id}' not found`);
      }
    }

    return this.prisma.ai_chat_sessions.update({
      where: { id },
      data: {
        user_id: dto.user_id !== undefined ? dto.user_id : session.user_id,
        platform: dto.platform ?? session.platform,
        external_session_id: dto.external_session_id !== undefined ? dto.external_session_id : session.external_session_id,
        last_intent: dto.last_intent !== undefined ? dto.last_intent : session.last_intent,
        updated_at: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      // Delete child messages first
      await tx.ai_chat_messages.deleteMany({
        where: { session_id: id },
      });

      return tx.ai_chat_sessions.delete({
        where: { id },
      });
    });
  }
}
