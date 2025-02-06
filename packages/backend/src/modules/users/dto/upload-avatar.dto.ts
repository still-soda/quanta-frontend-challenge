import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarDto {
  @ApiProperty({
    description: '头像文件，最大不超过 5MB',
    format: 'binary',
    type: 'string',
    required: true,
  })
  file: File;
}
