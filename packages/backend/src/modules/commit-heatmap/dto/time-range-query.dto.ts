import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';

/**
 * 时间范围查询 DTO。
 */
export class TimeRangeQueryDto {
  @ApiProperty({
    description: '开始日期',
    example: '2021-01-01',
  })
  @IsDateString()
  @Expose()
  startDate: string;

  @ApiProperty({
    description: '结束日期',
    example: '2021-01-31',
  })
  @IsDateString()
  @Expose()
  endDate: string;

  @ApiProperty({
    description: '用户 ID',
    example: '60f1e1f3b9e7f3a3c4d2d6a3',
  })
  @IsString()
  @Expose()
  userId: string;
}
