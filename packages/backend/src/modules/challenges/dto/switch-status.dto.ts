import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsEnum } from 'class-validator';
import { ChallengeStatus } from '../../../schemas/challenges.schema';

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
    description: '新的状态',
    example: true,
    required: true,
    enum: ['ready', 'published', 'closed'],
  })
  @IsEnum(['ready', 'published', 'closed'] as ChallengeStatus[])
  @Expose()
  status: ChallengeStatus;
}
