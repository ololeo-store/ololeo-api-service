import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsNumber()
  @IsOptional()
  price_per_unit?: number;
}

export class UpdateRawMaterialDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  price_per_unit?: number;
}
