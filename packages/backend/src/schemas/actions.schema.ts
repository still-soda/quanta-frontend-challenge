import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type ActionsDocument = Actions & Document;

@Schema()
@ApiSchema({ description: '用户活动' })
export class Actions extends Document {
  @ApiProperty({
    description: '标题',
    example: 'Solve Challenge',
  })
  @Prop()
  title: string;

  @ApiProperty({
    description: '活动类型',
    example: 'solve-challenge',
  })
  @Prop()
  type: string;

  @ApiProperty({
    description: '关键数据JSON字符串',
    example: '{ "challengeName": "CSS Battle" }',
  })
  @Prop()
  payload: string;

  @ApiProperty({
    description: '用户ID',
    example: '1234567',
  })
  @Prop()
  userId: string;

  @ApiProperty({
    description: '创建时间',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Prop()
  createdAt: Date;
}

export const ActionsSchema = SchemaFactory.createForClass(Actions);
