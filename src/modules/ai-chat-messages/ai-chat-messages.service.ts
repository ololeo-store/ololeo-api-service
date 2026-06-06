import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAiChatMessageDto, UpdateAiChatMessageDto } from './dto/ai-chat-message.dto.js';
import { randomUUID } from 'crypto';

@Injectable()
export class AiChatMessagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAiChatMessageDto) {
    // 1. Verify session exists
    const session = await this.prisma.ai_chat_sessions.findUnique({
      where: { id: dto.session_id },
    });
    if (!session) {
      throw new NotFoundException(`AI Chat Session with ID '${dto.session_id}' not found`);
    }

    return this.prisma.ai_chat_messages.create({
      data: {
        id: randomUUID(),
        session_id: dto.session_id,
        sender: dto.sender,
        message_text: dto.message_text,
      },
      include: {
        ai_chat_sessions: true,
      },
    });
  }

  async findAll() {
    return this.prisma.ai_chat_messages.findMany({
      include: {
        ai_chat_sessions: true,
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.ai_chat_messages.findUnique({
      where: { id },
      include: {
        ai_chat_sessions: true,
      },
    });

    if (!message) {
      throw new NotFoundException(`AI Chat Message with ID '${id}' not found`);
    }

    return message;
  }

  async update(id: string, dto: UpdateAiChatMessageDto) {
    const message = await this.findOne(id);

    return this.prisma.ai_chat_messages.update({
      where: { id },
      data: {
        sender: dto.sender ?? message.sender,
        message_text: dto.message_text ?? message.message_text,
      },
      include: {
        ai_chat_sessions: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.ai_chat_messages.delete({
      where: { id },
    });
  }
}
