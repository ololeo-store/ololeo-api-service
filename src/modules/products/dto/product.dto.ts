import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'category-uuid-123', description: 'The ID of the category' })
  @IsString()
  @IsNotEmpty()
  category_id!: string;

  @ApiProperty({ example: 'Rendang Sapi', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 15000, description: 'The price of the product' })
  @IsInt()
  @Min(0)
  price!: number;
  
  @ApiProperty({ example: 12000, description: 'The discount price of the product', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  discount_price?: number;

  @ApiProperty({ example: 'https://example.com/rendang.jpg', description: 'The image URL of the product', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ example: 'Rendang sapi khas Minang', description: 'The description of the product', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 50, description: 'The stock quantity of the product' })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: true, description: 'Whether the product is active', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'category-uuid-123', description: 'The ID of the category', required: false })
  @IsString()
  @IsOptional()
  category_id?: string;

  @ApiProperty({ example: 'Rendang Sapi Spesial', description: 'The name of the product', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 17000, description: 'The price of the product', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 14000, description: 'The discount price of the product', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  discount_price?: number;

  @ApiProperty({ example: 'https://example.com/rendang-spesial.jpg', description: 'The image URL of the product', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ example: 'Rendang sapi premium khas Minang', description: 'The description of the product', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 45, description: 'The stock quantity of the product', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: false, description: 'Whether the product is active', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
