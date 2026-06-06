import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'order-uuid-123', description: 'The ID of the associated order' })
  @IsString()
  @IsNotEmpty()
  order_id!: string;

  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product' })
  @IsString()
  @IsNotEmpty()
  product_id!: string;

  @ApiProperty({ example: 2, description: 'The quantity ordered' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ example: 15000, description: 'The price at the time of order (optional, will default to current product price)', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  price_at_order?: number;
}

export class UpdateOrderItemDto {
  @ApiProperty({ example: 'order-uuid-123', description: 'The ID of the associated order', required: false })
  @IsString()
  @IsOptional()
  order_id?: string;

  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 3, description: 'The quantity ordered', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({ example: 16000, description: 'The price at the time of order', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  price_at_order?: number;
}
