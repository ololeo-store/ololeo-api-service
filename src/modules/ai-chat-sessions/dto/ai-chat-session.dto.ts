import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAiChatSessionDto {
  @ApiProperty({ example: 'user-uuid-123', description: 'The ID of the user associated with this session', required: false })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ example: 'whatsapp', description: 'The platform of the session (e.g. web, whatsapp, telegram)' })
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @ApiProperty({ example: 'wa-session-9876', description: 'External session identifier if any', required: false })
  @IsString()
  @IsOptional()
  external_session_id?: string;

  @ApiProperty({ example: 'order_food', description: 'The last resolved intent', required: false })
  @IsString()
  @IsOptional()
  last_intent?: string;
}

export class UpdateAiChatSessionDto {
  @ApiProperty({ example: 'user-uuid-123', description: 'The ID of the user', required: false })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ example: 'web', description: 'The platform', required: false })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiProperty({ example: 'web-session-111', description: 'External session ID', required: false })
  @IsString()
  @IsOptional()
  external_session_id?: string;

  @ApiProperty({ example: 'check_status', description: 'Last intent', required: false })
  @IsString()
  @IsOptional()
  last_intent?: string;
}
