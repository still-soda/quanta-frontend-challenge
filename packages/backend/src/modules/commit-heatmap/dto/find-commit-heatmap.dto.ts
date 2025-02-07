import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';

export class FindCommitHeatmapDto {
  @ApiProperty({ description: '用户 ID' })
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty({ description: '日期' })
  @IsDateString()
  @Expose()
  date: string;
}
