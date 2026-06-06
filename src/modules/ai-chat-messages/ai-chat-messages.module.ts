import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AiChatMessagesService } from './ai-chat-messages.service.js';
import { AiChatMessagesController } from './ai-chat-messages.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [AiChatMessagesService],
  controllers: [AiChatMessagesController],
  exports: [AiChatMessagesService],
})
export class AiChatMessagesModule {}
