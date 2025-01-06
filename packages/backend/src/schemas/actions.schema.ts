import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type ActionsDocument = Actions & Document;

@Schema()
@ApiSchema({ description: '用户活动' })
export class Actions extends Document {
  @ApiProperty({
    example: 'Solve Challenge',
    description: '标题',
  })
  @Prop()
  title: string;

  @ApiProperty({
    example: '活动类型',
    description: 'solve-challenge',
  })
  @Prop()
  type: string;

  @ApiProperty({
    example: '用户在CSS Battle中解决了一个挑战',
    description: '活动内容',
  })
  @Prop()
  content: string;

  @ApiProperty({
    example: '1234567',
    description: '用户ID',
  })
  @Prop()
  userId: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop()
  createdAt: Date;
}

export const ActionsSchema = SchemaFactory.createForClass(Actions);
