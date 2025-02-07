import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type NotificationsDocument = Notifications & Document;

export type NotificationStatus = 'draft' | 'published';

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
    example: '123456',
    description: '内容文件元数据ID',
  })
  @Prop()
  contentId: string;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '封面链接',
  })
  @Prop()
  coverUrl: string;

  @ApiProperty({
    example: 'draft',
    description: '状态：draft 草稿，published 已发布',
  })
  @Prop({ default: 'draft' })
  status: NotificationStatus;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop({ default: Date.now })
  createdAt?: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
