import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SchemaProp } from '../../../utils/schema-prop.util';

export class OwnerGetUserDto {
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
    example: 'email',
    required: true,
    description: '邮箱',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'phone',
    required: true,
    description: '手机号',
  })
  @Expose()
  phone: string;

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
    example: 'https://www.gravatar.com/avatar/',
    default: '',
    required: true,
    description: '头像URL',
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

  @ApiProperty({
    example: ['1', '2', '3'],
    required: true,
    description: '已解决任务ID',
  })
  @Expose()
  solvedTasks: string[];

  @ApiProperty({
    example: ['1', '2', '3'],
    required: true,
    description: '失败任务ID',
  })
  @Expose()
  failedTasks: string[];

  @ApiProperty({
    example: ['1', '2', '3'],
    required: true,
    description: '已尝试任务ID',
  })
  @Expose()
  tryingTasks: string[];
}

/**
 * 用户信息 Schema，用于 Swagger 文档
 */
export const ownerGetUserDtoProps: SchemaProp = {
  username: {
    type: 'string',
    example: 'username',
    required: true,
    description: '用户名',
  },
  number: {
    type: 'string',
    example: '20231003059',
    required: true,
    description: '学号',
  },
  email: {
    type: 'string',
    example: 'email@qq.com',
    required: true,
    description: '邮箱',
  },
  phone: {
    type: 'string',
    example: '13411100000',
    required: true,
    description: '手机号',
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
    example: 'xxxxxxxxxxx',
    default: '',
    required: true,
    description: '头像文件 ID',
  },
  signature: {
    type: 'string',
    example: 'signature',
    default: '',
    required: true,
    description: '个性签名',
  },
  solvedTasks: {
    type: 'array',
    items: { type: 'string' },
    example: ['1', '2', '3'],
    required: true,
    description: '已解决任务ID',
  },
  failedTasks: {
    type: 'array',
    items: { type: 'string' },
    example: ['1', '2', '3'],
    required: true,
    description: '失败任务ID',
  },
  tryingTasks: {
    type: 'array',
    items: { type: 'string' },
    example: ['1', '2', '3'],
    required: true,
    description: '已尝试任务ID',
  },
};
