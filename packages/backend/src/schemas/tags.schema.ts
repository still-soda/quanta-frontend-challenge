import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagsDocument = Tags & Document;

@Schema({ timestamps: true })
export class Tags extends Document {
  @ApiProperty({
    description: '标签名',
    example: '前端',
  })
  @Prop({ index: true, unique: true })
  name: string;

  @ApiProperty({
    description: '创建者ID',
    example: '5f0b0f6b8f8b9f2c4',
  })
  @Prop({ index: true })
  creatorId: string;

  @ApiProperty({
    description: '描述',
    example: '前端开发相关',
    default: '',
  })
  @Prop({ default: '' })
  description: string;

  @ApiProperty({
    description: '颜色',
    example: '#D4D5D9',
    default: '#D4D5D9',
  })
  @Prop({ default: '#D4D5D9' })
  color: string;

  @ApiProperty({
    description: '图标',
    example: 'icon',
    default: '',
  })
  @Prop({ default: '' })
  icon: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);
