/// 用户自己更新自己的信息的 DTO，可更新内容比 UpdateUserDto 少

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, Length, IsEmail, IsString } from 'class-validator';

/**
 * 用户自己更新自己的信息的 DTO，可更新内容比 UpdateUserDto 少
 */
export class UserUpdateDto {
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
    example: '13411100000',
    required: false,
    description: '手机号',
  })
  @IsOptional()
  @Length(11, 11, { message: '手机号长度必须是11' })
  @Expose()
  phone?: string;

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
}
