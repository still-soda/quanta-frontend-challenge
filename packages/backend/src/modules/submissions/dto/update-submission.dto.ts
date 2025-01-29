import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SubmissionStatus } from 'src/schemas/submissions.schema';

export class UpdateSubmissionDto {
  @ApiProperty({ example: '1234556', description: '挑战ID' })
  @IsOptional()
  @IsString()
  @Expose()
  challengeId?: string;

  @ApiProperty({ example: '123456', description: '用户ID' })
  @IsOptional()
  @IsString()
  @Expose()
  userId?: string;

  @ApiProperty({ example: 30, description: '得分，-1表示未评分' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  score?: number;

  @ApiProperty({ example: 0.7, description: '正确率，-1表示未评分' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Expose()
  correctRate?: number;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'failed', 'passed'],
    description: '判题状态',
  })
  @IsOptional()
  @IsEnum(['pending', 'failed', 'passed'])
  @Expose()
  status?: SubmissionStatus;

  @ApiProperty({ example: '提交成功', description: '消息' })
  @IsOptional()
  @IsString()
  @Expose()
  message?: string;
}
