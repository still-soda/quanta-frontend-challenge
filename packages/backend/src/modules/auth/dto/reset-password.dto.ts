import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({
    description: '新密码',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @Expose()
  newPassword: string;
}
