import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'order-uuid-123', description: 'The ID of the order' })
  @IsString()
  @IsNotEmpty()
  order_id!: string;

  @ApiProperty({ example: 'trx-987654321', description: 'Unique transaction ID from payment gateway' })
  @IsString()
  @IsNotEmpty()
  transaction_id!: string;

  @ApiProperty({ example: 'success', description: 'Status of the payment (e.g. pending, success, failed)' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ example: 15000, description: 'Amount paid' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ example: 'qris', description: 'Payment method/type (e.g. qris, bank_transfer, gopay)' })
  @IsString()
  @IsNotEmpty()
  payment_type!: string;

  @ApiProperty({ example: '{"transaction_status":"settlement"}', description: 'Raw response payload from payment gateway' })
  @IsString()
  @IsNotEmpty()
  raw_payload!: string;
}

export class UpdatePaymentDto {
  @ApiProperty({ example: 'success', description: 'Status of the payment', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 15000, description: 'Amount paid', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 'qris', description: 'Payment method/type', required: false })
  @IsString()
  @IsOptional()
  payment_type?: string;

  @ApiProperty({ example: '{"transaction_status":"settlement"}', description: 'Raw response payload from payment gateway', required: false })
  @IsString()
  @IsOptional()
  raw_payload?: string;
}
