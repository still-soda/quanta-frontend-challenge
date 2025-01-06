import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type NotificationsDocument = Notifications & Document;

@Schema()
@ApiSchema({ description: '公告' })
export class Notifications extends Document {
  @ApiProperty({
    example: 'Solve Challenge',
    description: '标题',
  })
  @Prop()
  title: string;

  @ApiProperty({
    example: '这是公告简介',
    description: '简介',
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: '123456',
    description: '作者ID',
  })
  @Prop()
  authorId: string;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '封面链接',
  })
  @Prop()
  coverUrl: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop()
  createdAt: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
