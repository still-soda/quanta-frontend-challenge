import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description: '用户名',
  })
  @Length(1, 20, { message: '用户名长度必须在1到20之间' })
  username: string;

  @ApiProperty({
    example: 'number',
    description: '学号',
  })
  @Length(11, 11, { message: '学号长度必须是11' })
  number: string;

  @ApiProperty({
    example: 'email',
    description: '邮箱',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({
    example: 'password',
    description: '密码',
  })
  password: string;

  @ApiProperty({
    example: 'phone',
    description: '手机号',
  })
  @Length(11, 11, { message: '手机号长度必须是11' })
  phone: string;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '头像URL',
  })
  avatarUrl?: string;

  @ApiProperty({
    example: 'signature',
    description: '个性签名',
  })
  @Length(0, 100, { message: '个性签名长度不能超过100' })
  signature?: string;

  @ApiProperty({
    example: 0,
    enum: [0, 1],
    description: '角色：0-用户，1-管理员',
  })
  @IsEnum([0, 1], { message: '角色只能是0或1' })
  role?: number;
}
