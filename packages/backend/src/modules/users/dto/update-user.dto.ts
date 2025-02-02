import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  Length,
  IsEnum,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 20, { message: '用户名长度必须在1到20之间' })
  @Expose()
  username?: string;

  @IsOptional()
  @Length(11, 11, { message: '学号长度必须是11' })
  @Expose()
  number?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @Expose()
  email?: string;

  @IsOptional()
  @IsString()
  @Expose()
  passwordHash?: string;

  @IsOptional()
  @IsString()
  @Expose()
  salt?: string;

  @IsOptional()
  @Length(11, 11, { message: '手机号长度必须是11' })
  @Expose()
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '挑战总分不能小于0' })
  @Expose()
  totalScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '总提交次数不能小于0' })
  @Expose()
  totalSubmissions?: number;

  @IsOptional()
  @IsString()
  @Expose()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: '个性签名长度不能超过100' })
  @Expose()
  signature?: string;

  @IsOptional()
  @IsEnum([0, 1], { message: '角色只能是0或1' })
  @Expose()
  role?: number;
}
