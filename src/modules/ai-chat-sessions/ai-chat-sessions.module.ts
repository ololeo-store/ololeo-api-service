import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AiChatSessionsService } from './ai-chat-sessions.service.js';
import { AiChatSessionsController } from './ai-chat-sessions.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [AiChatSessionsService],
  controllers: [AiChatSessionsController],
  exports: [AiChatSessionsService],
})
export class AiChatSessionsModule {}
