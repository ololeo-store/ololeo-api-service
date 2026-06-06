import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@example.com', description: 'The email of the user', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user (min 6 characters)', minLength: 6, required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '08123456789', description: 'The phone number of the user', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: 'customer', description: 'The role of the user (e.g. admin, customer)', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'admin@example.com', description: 'The email of the user', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'The new password of the user (min 6 characters)', minLength: 6, required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'John Doe Update', description: 'The name of the user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '081234567890', description: 'The phone number of the user', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: 'admin', description: 'The role of the user', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}
