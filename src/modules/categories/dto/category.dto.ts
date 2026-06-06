import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Elektronik', description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Kategori untuk produk elektronik', description: 'The description of the category', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Elektronik Baru', description: 'The name of the category', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Deskripsi terupdate', description: 'The description of the category', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
