import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @Expose()
  password: string;
}
