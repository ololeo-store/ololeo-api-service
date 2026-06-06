import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreSettingDto {
  @ApiProperty({ example: 'store_name', description: 'The unique key for the store setting' })
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiProperty({ example: 'My Bakery Shop', description: 'The value for the store setting' })
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class UpdateStoreSettingDto {
  @ApiProperty({ example: 'My Bakery Shop Updated', description: 'The new value for the store setting' })
  @IsString()
  @IsNotEmpty()
  value!: string;
}
