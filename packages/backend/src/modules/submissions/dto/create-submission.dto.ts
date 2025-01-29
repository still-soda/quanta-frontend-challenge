import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { SubmissionType } from 'src/schemas/submissions.schema';

export class CreateSubmissionDto {
  @ApiProperty({ example: '1234556', description: '挑战ID' })
  @IsString()
  @Expose()
  challengeId: string;

  @ApiProperty({ example: '123456', description: '用户ID' })
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty({ example: 'execute', description: '提交类型' })
  @IsEnum(['execute', 'preExecute'])
  @Expose()
  type: SubmissionType;
}
