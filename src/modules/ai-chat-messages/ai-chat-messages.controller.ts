import { Body, Controller, Delete, Param, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiChatMessagesService } from './ai-chat-messages.service.js';
import { CreateAiChatMessageDto, UpdateAiChatMessageDto } from './dto/ai-chat-message.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('AI Chat Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-chat-messages')
export class AiChatMessagesController {
  constructor(private readonly aiChatMessagesService: AiChatMessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI chat message' })
  @ApiResponse({ status: 201, description: 'AI Chat message successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Chat Session not found.' })
  async create(@Body() createAiChatMessageDto: CreateAiChatMessageDto) {
    return this.aiChatMessagesService.create(createAiChatMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI chat messages' })
  @ApiResponse({ status: 200, description: 'Return all AI chat messages.' })
  async findAll() {
    return this.aiChatMessagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AI chat message details by ID' })
  @ApiResponse({ status: 200, description: 'Return message.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  async findOne(@Param('id') id: string) {
    return this.aiChatMessagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update AI chat message details' })
  @ApiResponse({ status: 200, description: 'Message successfully updated.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  async update(@Param('id') id: string, @Body() updateAiChatMessageDto: UpdateAiChatMessageDto) {
    return this.aiChatMessagesService.update(id, updateAiChatMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete AI chat message' })
  @ApiResponse({ status: 200, description: 'Message successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  async remove(@Param('id') id: string) {
    return this.aiChatMessagesService.remove(id);
  }
}
