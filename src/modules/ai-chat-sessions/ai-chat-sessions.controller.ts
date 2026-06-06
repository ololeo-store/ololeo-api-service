import { Body, Controller, Delete, Param, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiChatSessionsService } from './ai-chat-sessions.service.js';
import { CreateAiChatSessionDto, UpdateAiChatSessionDto } from './dto/ai-chat-session.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('AI Chat Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-chat-sessions')
export class AiChatSessionsController {
  constructor(private readonly aiChatSessionsService: AiChatSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI chat session' })
  @ApiResponse({ status: 201, description: 'AI Chat session successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async create(@Body() createAiChatSessionDto: CreateAiChatSessionDto) {
    return this.aiChatSessionsService.create(createAiChatSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI chat sessions' })
  @ApiResponse({ status: 200, description: 'Return all AI chat sessions.' })
  async findAll() {
    return this.aiChatSessionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AI chat session details by ID' })
  @ApiResponse({ status: 200, description: 'Return session details with messages.' })
  @ApiResponse({ status: 404, description: 'Session not found.' })
  async findOne(@Param('id') id: string) {
    return this.aiChatSessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update AI chat session details' })
  @ApiResponse({ status: 200, description: 'Session successfully updated.' })
  @ApiResponse({ status: 404, description: 'Session or User not found.' })
  async update(@Param('id') id: string, @Body() updateAiChatSessionDto: UpdateAiChatSessionDto) {
    return this.aiChatSessionsService.update(id, updateAiChatSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete AI chat session' })
  @ApiResponse({ status: 200, description: 'Session and its messages successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Session not found.' })
  async remove(@Param('id') id: string) {
    return this.aiChatSessionsService.remove(id);
  }
}
