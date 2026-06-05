import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'John Doe', description: 'The full name of the user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '08123456789', description: 'WhatsApp phone number', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
