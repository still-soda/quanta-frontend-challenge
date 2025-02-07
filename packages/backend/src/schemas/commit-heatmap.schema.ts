import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CommitHeatmapDocument = CommitHeatmap & Document;

@Schema()
export class CommitHeatmap {
  @ApiProperty({
    example: '2021-01-01',
    description: '日期',
    required: true,
  })
  @Prop({ required: true, type: Date })
  date: Date;

  @ApiProperty({
    example: 123,
    description: '提交次数',
    default: 0,
  })
  @Prop({ default: 0 })
  count: number;

  @ApiProperty({
    example: '123',
    description: '用户 ID',
    required: true,
  })
  @Prop({ required: true })
  userId: string;
}

export const CommitHeatmapSchema = SchemaFactory.createForClass(CommitHeatmap);
