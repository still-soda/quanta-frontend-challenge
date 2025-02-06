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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'still_soda',
    required: false,
    description: '用户名',
  })
  @IsOptional()
  @Length(1, 20, { message: '用户名长度必须在1到20之间' })
  @Expose()
  username?: string;

  @ApiProperty({
    example: '20231003059',
    required: false,
    description: '学号，11 位',
  })
  @IsOptional()
  @Length(11, 11, { message: '学号长度必须是11' })
  @Expose()
  number?: string;

  @ApiProperty({
    example: 'test@email.com',
    required: false,
    description: '邮箱',
  })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @Expose()
  email?: string;

  @ApiProperty({
    example: 'xxx',
    required: false,
    description: '密码哈希',
  })
  @IsOptional()
  @IsString()
  @Expose()
  passwordHash?: string;

  @ApiProperty({
    example: 'xxx',
    required: false,
    description: '密码哈希盐',
  })
  @IsOptional()
  @IsString()
  @Expose()
  salt?: string;

  @ApiProperty({
    example: '13411100000',
    required: false,
    description: '手机号',
  })
  @IsOptional()
  @Length(11, 11, { message: '手机号长度必须是11' })
  @Expose()
  phone?: string;

  @ApiProperty({
    example: 0,
    required: false,
    description: '总分',
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: '挑战总分不能小于0' })
  @Expose()
  totalScore?: number;

  @ApiProperty({
    example: 0,
    required: false,
    description: '总提交次数',
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: '总提交次数不能小于0' })
  @Expose()
  totalSubmissions?: number;

  @ApiProperty({
    example: 'xxxxxxxxxxxxx',
    required: false,
    description: '头像文件 ID',
  })
  @IsOptional()
  @IsString()
  @Expose()
  avatarId?: string;

  @ApiProperty({
    example: '你好世界',
    required: false,
    description: '个性签名，不超过 100 字',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100, { message: '个性签名长度不能超过100' })
  @Expose()
  signature?: string;

  @ApiProperty({
    example: 0,
    enum: [0, 1],
    required: false,
    description: '角色',
  })
  @IsOptional()
  @IsEnum([0, 1], { message: '角色只能是0或1' })
  @Expose()
  role?: number;
}
