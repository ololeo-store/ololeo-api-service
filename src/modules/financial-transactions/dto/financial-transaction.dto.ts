import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateFinancialTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['income', 'expense'])
  type!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  date?: string;
}

export class UpdateFinancialTransactionDto {
  @IsString()
  @IsOptional()
  @IsIn(['income', 'expense'])
  type?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  date?: string;
}
