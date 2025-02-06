import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginDto {
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
  @Expose()
  password: string;
}
