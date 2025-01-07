import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description: '用户名',
  })
  @IsString()
  @Length(1, 20, { message: '用户名长度必须在1到20之间' })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'number',
    description: '学号',
  })
  @IsString()
  @Length(11, 11, { message: '学号长度必须是11' })
  @Expose()
  number: string;

  @ApiProperty({
    example: 'email',
    description: '邮箱',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'password',
    description: '密码',
  })
  @IsString()
  @Expose()
  password: string;

  @ApiProperty({
    example: 'phone',
    description: '手机号',
  })
  @IsString()
  @Length(11, 11, { message: '手机号长度必须是11' })
  @Expose()
  phone: string;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '头像URL',
  })
  @IsString()
  @Expose()
  avatarUrl?: string;

  @ApiProperty({
    example: 'signature',
    description: '个性签名',
  })
  @IsString()
  @Length(0, 100, { message: '个性签名长度不能超过100' })
  @Expose()
  signature?: string;

  @ApiProperty({
    example: 0,
    enum: [0, 1],
    description: '角色：0-用户，1-管理员',
  })
  @IsEnum([0, 1], { message: '角色只能是0或1' })
  @Expose()
  role?: number;
}
