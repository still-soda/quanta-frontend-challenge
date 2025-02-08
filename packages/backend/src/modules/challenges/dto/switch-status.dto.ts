import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsEnum } from 'class-validator';
import { CHALLENGE_STATUS } from '../../../schemas/challenges.schema';

export class ChallengeSwitchStatusDto {
  @ApiProperty({
    description: '公告ID',
    example: '60b9f4f4c8c9d7c0e6b9a0b4',
    required: true,
  })
  @IsMongoId()
  @Expose()
  id: string;

  @ApiProperty({
    description: '新的状态，可选值为 1:ready, 2:published, 3:closed',
    example: true,
    required: true,
    enum: [
      CHALLENGE_STATUS.READY,
      CHALLENGE_STATUS.PUBLISHED,
      CHALLENGE_STATUS.CLOSED,
    ],
  })
  @IsEnum([
    CHALLENGE_STATUS.READY,
    CHALLENGE_STATUS.PUBLISHED,
    CHALLENGE_STATUS.CLOSED,
  ])
  @Expose()
  status: CHALLENGE_STATUS;
}
