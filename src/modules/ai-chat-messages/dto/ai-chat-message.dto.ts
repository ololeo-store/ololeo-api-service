import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAiChatMessageDto {
  @ApiProperty({ example: 'session-uuid-123', description: 'The ID of the associated chat session' })
  @IsString()
  @IsNotEmpty()
  session_id!: string;

  @ApiProperty({ example: 'user', description: 'The sender of the message (e.g. user, assistant)' })
  @IsString()
  @IsNotEmpty()
  sender!: string;

  @ApiProperty({ example: 'Halo, saya ingin memesan makanan.', description: 'The text content of the message' })
  @IsString()
  @IsNotEmpty()
  message_text!: string;
}

export class UpdateAiChatMessageDto {
  @ApiProperty({ example: 'assistant', description: 'The sender role', required: false })
  @IsString()
  @IsOptional()
  sender?: string;

  @ApiProperty({ example: 'Pesan terupdate.', description: 'The text content', required: false })
  @IsString()
  @IsOptional()
  message_text?: string;
}
