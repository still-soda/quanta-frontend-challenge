import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OwnerGetUserDto {
  @ApiProperty({
    example: 'username',
    description: '用户名',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'number',
    description: '学号',
  })
  @Expose()
  number: string;

  @ApiProperty({
    example: 'email',
    description: '邮箱',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'phone',
    description: '手机号',
  })
  @Expose()
  phone: string;

  @ApiProperty({
    example: 0,
    default: 0,
    description: '挑战总分',
  })
  @Expose()
  totalScore: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: '总提交次数',
  })
  @Expose()
  totalSubmissions: number;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    default: '',
    description: '头像URL',
  })
  @Expose()
  avatarUrl: string;

  @ApiProperty({
    example: 'signature',
    default: '',
    description: '个性签名',
  })
  @Expose()
  signature: string;

  @ApiProperty({
    example: ['1', '2', '3'],
    description: '已解决任务ID',
  })
  @Expose()
  solvedTasks: string[];

  @ApiProperty({
    example: ['1', '2', '3'],
    description: '失败任务ID',
  })
  @Expose()
  failedTasks: string[];

  @ApiProperty({
    example: ['1', '2', '3'],
    description: '已尝试任务ID',
  })
  @Expose()
  tryingTasks: string[];
}

/**
 * 用户信息 Schema，用于 Swagger 文档
 */
export const ownerGetUserDtoProps = {
  username: { type: 'string', example: 'username', description: '用户名' },
  number: { type: 'string', example: 'number', description: '学号' },
  email: { type: 'string', example: 'email', description: '邮箱' },
  phone: { type: 'string', example: 'phone', description: '手机号' },
  totalScore: {
    type: 'number',
    example: 0,
    default: 0,
    description: '挑战总分',
  },
  totalSubmissions: {
    type: 'number',
    example: 0,
    default: 0,
    description: '总提交次数',
  },
  avatarUrl: {
    type: 'string',
    example: 'https://www.gravatar.com/avatar/',
    default: '',
    description: '头像URL',
  },
  signature: {
    type: 'string',
    example: 'signature',
    default: '',
    description: '个性签名',
  },
  solvedTasks: {
    type: 'array',
    items: { type: 'string' },
    example: ['1', '2', '3'],
    description: '已解决任务ID',
  },
  failedTasks: {
    type: 'array',
    items: { type: 'string' },
    example: ['1', '2', '3'],
    description: '失败任务ID',
  },
  tryingTasks: {
    type: 'array',
    items: { type: 'string' },
    example: ['1', '2', '3'],
    description: '已尝试任务ID',
  },
};
