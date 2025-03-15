import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { SchemaProp } from '../../../utils/schema-prop.util';

export class CreateResolvedChallengeDto {
  @ApiProperty({
    type: String,
    description: '挑战ID',
  })
  @IsMongoId()
  @Expose()
  challengeId: string;

  @ApiProperty({
    type: String,
    description: '用户ID',
  })
  @IsMongoId()
  @Expose()
  userId: string;
}

export const createResolveChallengeDtoProps: SchemaProp = {
  challengeId: {
    type: 'string',
    required: true,
    example: '60f1b3b3b3b3b3b3b3b3b3b3',
    description: '挑战ID',
  },
  userId: {
    type: 'string',
    required: true,
    example: '60f1b3b3b3b3b3b3b3b3b3',
    description: '用户ID',
  },
};
