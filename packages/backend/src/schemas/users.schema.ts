import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type UsersDocument = Users & Document;

@Schema()
@ApiSchema({ description: '用户' })
export class Users extends Document {
  @ApiProperty({
    example: 'username',
    description: '用户名',
  })
  @Prop()
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
    example: 'password',
    description: '密码',
  })
  @Prop()
  password: string;

  @ApiProperty({
    example: 'phone',
    description: '手机号',
  })
  @Prop()
  phone: string;

  @ApiProperty({
    example: '13400000000',
    description: '手机号',
  })
  @Prop()
  totalScore: number;

  @ApiProperty({
    example: 0,
    description: '挑战总分',
  })
  @Prop()
  totalSubmissions: number;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '头像URL',
  })
  @Prop()
  avatarUrl: string;

  @ApiProperty({
    example: 'signature',
    description: '个性签名',
  })
  @Prop()
  signature: string;

  @ApiProperty({
    example: 0,
    enum: [0, 1, 2],
    description: '角色：0-用户，1-管理员',
  })
  @Prop()
  role: number;

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
