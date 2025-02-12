import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type UsersDocument = Users & Document;

/**
 * 用户角色
 *
 * - 0: 用户
 * - 1: 管理员
 * - 2: 超级管理员
 */
export type Role = 0 | 1 | 2;

@Schema()
@ApiSchema({ description: '用户' })
export class Users extends Document {
  @ApiProperty({
    example: 'username',
    description: '用户名，唯一',
  })
  @Prop({ unique: true, index: true })
  username: string;

  @ApiProperty({
    example: 'number',
    description: '学号',
  })
  @Prop()
  number: string;

  @ApiProperty({
    example: 'email',
    description: '邮箱',
  })
  @Prop()
  email: string;

  @ApiProperty({
    example: 'passwordHash',
    description: '密码哈希（十六进制）',
  })
  @Prop()
  passwordHash: string;

  @ApiProperty({
    example: 'salt',
    description: '密码哈希盐',
  })
  @Prop()
  salt: string;

  @ApiProperty({
    example: 'phone',
    description: '手机号',
  })
  @Prop()
  phone: string;

  @ApiProperty({
    example: 0,
    default: 0,
    description: '挑战总分',
  })
  @Prop({ default: 0 })
  totalScore: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: '总提交次数',
  })
  @Prop({ default: 0 })
  totalSubmissions: number;

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxx',
    default: '',
    description: '头像文件 ID',
  })
  @Prop({ default: '' })
  avatarId: string;

  @ApiProperty({
    example: 'signature',
    default: '',
    description: '个性签名',
  })
  @Prop({ default: '' })
  signature: string;

  @ApiProperty({
    example: 0,
    enum: [0, 1, 2],
    description: '角色：0-用户，1-管理员，2-超级管理员',
  })
  @Prop({ default: 0 })
  role: Role;

  @ApiProperty({
    example: ['1', '2', '3'],
    description: '已解决任务ID',
  })
  @Prop()
  solvedTasks: string[];

  @ApiProperty({
    example: ['1', '2', '3'],
    description: '失败任务ID',
  })
  @Prop()
  failedTasks: string[];

  @ApiProperty({
    example: ['1', '2', '3'],
    description: '已尝试任务ID',
  })
  @Prop()
  tryingTasks: string[];

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '更新时间',
  })
  @Prop()
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
