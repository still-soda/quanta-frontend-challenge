import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  totalScore?: number;

  @IsOptional()
  @IsNumber()
  totalSubmissions?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsNumber()
  role?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  solvedTasks?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  failedTasks?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tryingTasks?: string[];
}
