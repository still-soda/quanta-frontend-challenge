import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type SubmissionsDocument = Submissions & Document;

export type SubmissionStatus = 'pending' | 'failed' | 'passed';

export type SubmissionType = 'execute' | 'preExecute';

@Schema()
@ApiSchema({ description: '提交' })
export class Submissions extends Document {
  @ApiProperty({
    example: '1234556',
    description: '挑战ID',
  })
  @Prop()
  challengeId: string;

  @ApiProperty({
    example: '123456',
    description: '用户ID',
  })
  @Prop()
  userId: string;

  @ApiProperty({
    example: 'preExecute',
    description: '提交类型',
    enum: ['execute', 'preExecute'],
  })
  @Prop()
  type: SubmissionType;

  @ApiProperty({
    example: 30,
    default: -1,
    description: '得分，-1表示未评分',
  })
  @Prop({ default: -1 })
  score: number;

  @ApiProperty({
    example: 0.7,
    default: -1,
    description: '正确率，-1表示未评分',
  })
  @Prop({ default: -1 })
  correctRate: number;

  @ApiProperty({
    example: 'pending',
    default: 'pending',
    enum: ['pending', 'failed', 'passed'],
    description: '判题状态',
  })
  @Prop({ default: 'pending' })
  status: SubmissionStatus;

  @ApiProperty({
    example: '提交成功',
    default: '',
    description: '消息',
  })
  @Prop({ default: '' })
  message: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop()
  createdAt: Date;
}

export const SubmissionsSchema = SchemaFactory.createForClass(Submissions);
