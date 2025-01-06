import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type SubmissionsDocument = Submissions & Document;

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
    example: true,
    default: false,
    description: '是否通过',
  })
  @Prop({ default: false })
  isPassed: boolean;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop()
  createdAt: Date;
}

export const SubmissionsSchema = SchemaFactory.createForClass(Submissions);
