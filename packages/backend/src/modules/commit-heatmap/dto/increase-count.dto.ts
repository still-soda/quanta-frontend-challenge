import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class IncreaseHeatmapCountDto {
  @ApiProperty({ description: '用户 ID' })
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty({ description: '日期' })
  @IsDateString()
  @Expose()
  date: string;

  @ApiProperty({ description: '增加的提交次数' })
  @IsNumber()
  @Expose()
  count: number;
}
