import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateStoreValueDto {
  @ApiProperty({ example: 'Pengiriman Cepat', description: 'The title of the store value' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'truck', description: 'Lucide icon name or image identifier' })
  @IsString()
  @IsNotEmpty()
  icon_name!: string;

  @ApiProperty({ example: 'Kami mengirim pesanan Anda dengan sangat cepat.', description: 'The content details of this value' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 1, description: 'Display order index' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  order_index!: number;
}

export class UpdateStoreValueDto {
  @ApiProperty({ example: 'Pengiriman Cepat Updated', description: 'The title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'truck-fast', description: 'Lucide icon name', required: false })
  @IsString()
  @IsOptional()
  icon_name?: string;

  @ApiProperty({ example: 'Detail pengiriman cepat terupdate.', description: 'The content details', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 2, description: 'Display order index', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order_index?: number;
}
