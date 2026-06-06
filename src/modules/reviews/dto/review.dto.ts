import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product being reviewed', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 'user-uuid-123', description: 'The ID of the user submitting the review', required: false })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ example: 'Jane Doe', description: 'The name of the customer reviewing the product' })
  @IsString()
  @IsNotEmpty()
  customer_name!: string;

  @ApiProperty({ example: 5, description: 'Rating score (1 to 5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({ example: 'Produk sangat bagus dan segar!', description: 'Optional text comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: false, description: 'Approval status of the review', required: false })
  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
}

export class UpdateReviewDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the product', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 'user-uuid-123', description: 'The ID of the user', required: false })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ example: 'Jane Doe Updated', description: 'The name of the customer', required: false })
  @IsString()
  @IsOptional()
  customer_name?: string;

  @ApiProperty({ example: 4, description: 'Rating score (1 to 5)', required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'Komentar terupdate', description: 'Optional text comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: true, description: 'Approval status of the review', required: false })
  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
}
