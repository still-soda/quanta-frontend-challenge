import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  Length,
  IsEnum,
  Min,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Length(1, 20, { message: '用户名长度必须在1到20之间' })
  username?: string;

  @IsOptional()
  @Length(11, 11, { message: '学号长度必须是11' })
  number?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString()
  @Min(6, { message: '密码长度不能小于6' })
  password?: string;

  @IsOptional()
  @Length(11, 11, { message: '手机号长度必须是11' })
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '挑战总分不能小于0' })
  totalScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '总提交次数不能小于0' })
  totalSubmissions?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: '个性签名长度不能超过100' })
  signature?: string;

  @IsOptional()
  @IsEnum([0, 1], { message: '角色只能是0或1' })
  role?: number;
}
