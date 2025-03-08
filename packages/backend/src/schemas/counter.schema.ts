import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema()
export class Counter {
  @ApiProperty({
    example: 'sequence',
    description: '序列名称',
  })
  @Prop({ required: true, unique: true, index: true })
  sequenceName: string;

  @ApiProperty({
    example: 0,
    default: 0,
    description: '序列值',
  })
  @Prop({ default: 0 })
  sequenceValue: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
