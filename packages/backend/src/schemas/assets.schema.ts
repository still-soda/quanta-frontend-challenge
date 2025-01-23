import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

export type AssetsDocument = Assets & Document;

@Schema()
@ApiSchema({ description: '本地资源' })
export class Assets extends Document {
  @ApiProperty({
    example: 'xxx.png',
    description: '文件名',
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'image/png',
    description: 'MIME 类型',
  })
  @Prop()
  mimeType: string;

  @ApiProperty({
    example: false,
    description: '是否为静态资源',
  })
  @Prop()
  isStatic: boolean;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: '创建时间',
  })
  @Prop()
  createdAt: Date;
}

export const AssetsSchema = SchemaFactory.createForClass(Assets);
