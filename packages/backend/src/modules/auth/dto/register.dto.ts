import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: '用户名',
    required: true,
    example: 'admin',
  })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({
    description: '密码',
    required: true,
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @Expose()
  password: string;

  @ApiProperty({
    description: '邮箱',
    required: true,
    example: 'still_soda@email.com',
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    description: '学号',
    required: true,
    example: '2018000000',
  })
  @IsString()
  @Length(11)
  @Expose()
  number: string;

  @ApiProperty({
    description: '手机号',
    required: true,
    example: '18888888888',
  })
  @IsPhoneNumber('CN')
  @Expose()
  phone: string;
}
