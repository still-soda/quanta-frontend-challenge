import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type ChallengesDocument = Challenges & Document;

export enum CHALLENGE_STATUS {
  DRAFT,
  READY,
  PUBLISHED,
  CLOSED,
}

@Schema()
@ApiSchema({ description: '挑战' })
export class Challenges extends Document {
  @ApiProperty({
    example: 'CSS Battle',
    description: '挑战名称',
  })
  @Prop()
  title: string;

  @ApiProperty({
    example: 1,
    description:
      '挑战状态，可选值为 0:draft, 1:ready, 2:published, 3:closed\n' +
      '分别表示草稿（预执行未执行或未通过）、准备中、已发布、已关闭',
    enum: CHALLENGE_STATUS,
    default: CHALLENGE_STATUS.DRAFT,
  })
  @Prop({ default: CHALLENGE_STATUS.DRAFT })
  status: CHALLENGE_STATUS;

  @ApiProperty({
    example: 123,
    default: 0,
    description: '总提交次数',
  })
  @Prop({ default: 0 })
  totalSubmissions: number;

  @ApiProperty({
    example: '1234567',
    description: '内容文件ID',
  })
  @Prop()
  contentId: string;

  @ApiProperty({
    example: 12,
    default: 0,
    description: '总通过次数',
  })
  @Prop({ default: 0 })
  totalPass: number;

  @ApiProperty({
    example: 'hard',
    description: '难度',
  })
  @Prop()
  difficulty: string;

  @ApiProperty({
    example: 40,
    description: '分数',
  })
  @Prop()
  score: number;

  @ApiProperty({
    example: 'css',
    description: '类型',
  })
  @Prop()
  type: string;

  @ApiProperty({
    example: '1234567',
    default: undefined,
    description: '流程数据ID',
  })
  @Prop()
  flowdataId?: string;

  @ApiProperty({
    example: ['1.html', '2.html', '3.html'],
    default: [],
    description: '标准答案文件名列表',
  })
  @Prop({ default: [] })
  standardAnswer: string[];

  @ApiProperty({
    example: ['1bxxx1', '2bxxx2', '3bxxx3'],
    default: [],
    description: '截图文件 ID 列表',
  })
  @Prop({ default: [] })
  screenshots: string[];

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    default: [],
    description: '标签',
  })
  @Prop({ default: [] })
  tags: string[];

  @ApiProperty({
    example: ['username'],
    default: [],
    description: '最快的前3个解决者',
  })
  @Prop({ default: [] })
  fastestSolvers: string[];

  @ApiProperty({
    example: '1234567',
    description: '作者ID',
  })
  @Prop()
  authorId: string;

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

export const ChallengesSchema = SchemaFactory.createForClass(Challenges);
