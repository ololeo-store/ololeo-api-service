import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product' })
  @IsString()
  @IsNotEmpty()
  product_id!: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed'], description: 'The type of discount' })
  @IsEnum(['percentage', 'fixed'])
  @IsNotEmpty()
  discount_type!: string;

  @ApiProperty({ example: 10, description: 'Percentage value or flat reduction value' })
  @IsInt()
  @Min(0)
  value!: number;

  @ApiProperty({ example: '2026-06-05T20:00:00.000Z', description: 'Start date and time of the discount' })
  @IsDateString()
  @IsNotEmpty()
  start_time!: string;

  @ApiProperty({ example: '2026-06-06T20:00:00.000Z', description: 'End date and time of the discount' })
  @IsDateString()
  @IsNotEmpty()
  end_time!: string;

  @ApiProperty({ example: true, description: 'Whether the discount is active', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateDiscountDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed'], description: 'The type of discount', required: false })
  @IsEnum(['percentage', 'fixed'])
  @IsOptional()
  discount_type?: string;

  @ApiProperty({ example: 15, description: 'Percentage value or flat reduction value', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  value?: number;

  @ApiProperty({ example: '2026-06-05T20:00:00.000Z', description: 'Start date and time of the discount', required: false })
  @IsDateString()
  @IsOptional()
  start_time?: string;

  @ApiProperty({ example: '2026-06-06T20:00:00.000Z', description: 'End date and time of the discount', required: false })
  @IsDateString()
  @IsOptional()
  end_time?: string;

  @ApiProperty({ example: true, description: 'Whether the discount is active', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
