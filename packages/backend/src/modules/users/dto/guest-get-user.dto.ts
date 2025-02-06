import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GuestGetUserDto {
  @ApiProperty({
    example: 'username',
    required: true,
    description: '用户名',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'number',
    required: true,
    description: '学号',
  })
  @Expose()
  number: string;

  @ApiProperty({
    example: 0,
    default: 0,
    required: true,
    description: '挑战总分',
  })
  @Expose()
  totalScore: number;

  @ApiProperty({
    example: 0,
    default: 0,
    required: true,
    description: '总提交次数',
  })
  @Expose()
  totalSubmissions: number;

  @ApiProperty({
    example: 'xxxxxxxxxxxx',
    default: '',
    required: true,
    description: '头像文件 ID',
  })
  @Expose()
  avatarId: string;

  @ApiProperty({
    example: 'signature',
    default: '',
    required: true,
    description: '个性签名',
  })
  @Expose()
  signature: string;
}

/**
 * 用户信息 Schema，用于 Swagger 文档
 */
export const guestGetUserDtoProps = {
  username: {
    type: 'string',
    required: true,
    example: 'username',
    description: '用户名',
  },
  number: {
    type: 'string',
    required: true,
    example: 'number',
    description: '学号',
  },
  totalScore: {
    type: 'number',
    example: 0,
    default: 0,
    required: true,
    description: '挑战总分',
  },
  totalSubmissions: {
    type: 'number',
    example: 0,
    default: 0,
    required: true,
    description: '总提交次数',
  },
  avatarId: {
    type: 'string',
    example: 'https://www.gravatar.com/avatar/',
    default: '',
    required: true,
    description: '头像URL',
  },
  signature: {
    type: 'string',
    example: 'signature',
    default: '',
    required: true,
    description: '个性签名',
  },
};
