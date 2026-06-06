import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product' })
  @IsString()
  @IsNotEmpty()
  product_id!: string;

  @ApiProperty({ example: 2, description: 'The quantity of the product to order' })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CustomerDto {
  @ApiProperty({ example: 'Jane Doe', description: 'The name of the customer' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '08123456789', description: 'The phone number of the customer' })
  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'user-uuid-123', description: 'The user ID if logged in', required: false })
  @IsString()
  @IsOptional()
  customer_id?: string;

  @ApiProperty({ type: CustomerDto, description: 'Customer details (stored as JSONB)' })
  @ValidateNested()
  @Type(() => CustomerDto)
  @IsNotEmpty()
  customer!: CustomerDto;

  @ApiProperty({ example: '2026-06-10T10:00:00.000Z', description: 'The date and time for pickup' })
  @IsDateString()
  @IsNotEmpty()
  pickup_date!: string;

  @ApiProperty({ example: 'Tolong sambal dipisah', description: 'Optional notes for the order', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [OrderItemDto], description: 'List of items to order' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'processing', description: 'Order status (e.g. pending, processing, completed, cancelled)', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'paid', description: 'Payment status (e.g. unpaid, paid, refunded)', required: false })
  @IsString()
  @IsOptional()
  payment_status?: string;

  @ApiProperty({ example: 'pay-token-123', description: 'Payment gateway token', required: false })
  @IsString()
  @IsOptional()
  payment_token?: string;

  @ApiProperty({ example: 'https://payment-url.com', description: 'Payment gateway redirect URL', required: false })
  @IsString()
  @IsOptional()
  payment_url?: string;
}
