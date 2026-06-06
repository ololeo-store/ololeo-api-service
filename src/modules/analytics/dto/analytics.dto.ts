import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogVisitDto {
  @ApiProperty({ example: '/shop', description: 'The pathname visited' })
  @IsString()
  @IsNotEmpty()
  path!: string;
}
