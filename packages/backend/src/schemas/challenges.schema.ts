import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type ChallengesDocument = Challenges & Document;

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
    example: 123,
    default: 0,
    description: '总提交次数',
  })
  @Prop()
  totalSubmissions: number;

  @ApiProperty({
    example: 12,
    default: 0,
    description: '总通过次数',
  })
  @Prop()
  totalPass: number;

  @ApiProperty({
    example: 'hard',
    description: '难度',
  })
  @Prop()
  difficulty: number;

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
    example: ['css', 'html', 'javascript'],
    default: [],
    description: '标签',
  })
  @Prop()
  tags: string[];

  @ApiProperty({
    example: ['username'],
    default: [],
    description: '最快的前3个解决者',
  })
  @Prop()
  fastestSolver: string[];

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
