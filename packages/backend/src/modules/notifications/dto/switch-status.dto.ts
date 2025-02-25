import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsEnum } from 'class-validator';
import { NotificationStatus } from '../../../schemas/notifications.schema';

export class NotificationSwitchStatusDto {
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
    enum: ['draft', 'published'],
  })
  @IsEnum(['draft', 'published'] as NotificationStatus[])
  @Expose()
  status: NotificationStatus;
}
