import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGalleryItemDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the associated product', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 'https://example.com/gallery/rendang.jpg', description: 'The image URL for this gallery item' })
  @IsString()
  @IsNotEmpty()
  image_url!: string;

  @ApiProperty({ example: 'Rendang daging sapi padang yang lezat', description: 'Optional caption for the gallery item', required: false })
  @IsString()
  @IsOptional()
  caption?: string;
}

export class UpdateGalleryItemDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'The ID of the associated product', required: false })
  @IsString()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: 'https://example.com/gallery/rendang-updated.jpg', description: 'The image URL', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ example: 'Caption terupdate', description: 'Optional caption', required: false })
  @IsString()
  @IsOptional()
  caption?: string;
}
