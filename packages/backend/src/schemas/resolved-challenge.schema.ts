import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ResolvedChallengeDocument = ResolvedChallenge & Document;

@Schema({ collection: 'resolved-challenges' })
export class ResolvedChallenge {
  @ApiProperty({
    example: '60b0c0c3f9b5c7001f9b5c7',
    description: '挑战ID',
  })
  @Prop({ required: true, index: true })
  challengeId: string;

  @ApiProperty({
    example: '60b0c0c3f9b5c7001f9b5c7',
    description: '用户ID',
  })
  @Prop({ required: true, index: true })
  userId: string;

  @ApiProperty({
    example: '2021-05-28T09:00:00.000Z',
    description: '解决时间',
  })
  @Prop({ required: true, default: () => new Date().toISOString() })
  resolvedAt: Date;

  @ApiProperty({
    example: 100,
    description: '解决用时 毫秒',
  })
  @Prop({ required: true })
  solution: number;

  @ApiProperty({
    example: 1,
    description: '解决排名',
  })
  @Prop({ required: true, index: true })
  rank: number;
}

export const ResolvedChallengeSchema =
  SchemaFactory.createForClass(ResolvedChallenge);
