import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    required: true,
    description: '用户名',
  })
  @IsString()
  @Length(1, 20, { message: '用户名长度必须在1到20之间' })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'number',
    required: true,
    description: '学号',
  })
  @IsString()
  @Length(11, 11, { message: '学号长度必须是11' })
  @Expose()
  number: string;

  @ApiProperty({
    example: 'email',
    required: true,
    description: '邮箱',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'passwordHash',
    required: true,
    description: '密码哈希',
  })
  @IsString()
  @Expose()
  passwordHash: string;

  @ApiProperty({
    example: 'salt',
    required: true,
    description: '密码哈希盐',
  })
  @IsString()
  @Expose()
  salt: string;

  @ApiProperty({
    example: 'phone',
    required: true,
    description: '手机号',
  })
  @IsString()
  @Length(11, 11, { message: '手机号长度必须是11' })
  @Expose()
  phone: string;

  @ApiProperty({
    example: 'xxxxxxxxxxx',
    required: false,
    description: '头像文件Id',
  })
  @IsOptional()
  @IsString()
  @Expose()
  avatarId?: string;

  @ApiProperty({
    example: 'signature',
    required: false,
    description: '个性签名',
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
    description: '角色：0-用户，1-管理员',
  })
  @IsOptional()
  @IsEnum([0, 1], { message: '角色只能是0或1' })
  @Expose()
  role?: number;
}
