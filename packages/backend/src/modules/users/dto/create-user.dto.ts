import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description: '用户名',
  })
  username: string;

  @ApiProperty({
    example: 'number',
    description: '学号',
  })
  number: string;

  @ApiProperty({
    example: 'email',
    description: '邮箱',
  })
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
  signature?: string;

  @ApiProperty({
    example: 0,
    enum: [0, 1, 2],
    description: '角色：0-用户，1-管理员',
  })
  role?: number;
}
