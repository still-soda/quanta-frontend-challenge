import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SchemaProp } from '../../../utils/schema-prop.util';

export class GetFileMetaDto {
  @ApiProperty({
    example: 'xxx.png',
    description: '本地文件名',
  })
  @Expose()
  localName: string;

  @ApiProperty({
    example: 'xxx.png',
    description: '原始文件名',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'image/png',
    description: 'MIME 类型',
  })
  @Expose()
  mimeType: string;
}

export const getFileMetaDtoProps: SchemaProp = {
  localName: {
    type: 'string',
    example: 'xxx.png',
    description: '本地文件名',
  },
  name: {
    type: 'string',
    example: 'xxx.png',
    description: '原始文件名',
  },
  mimeType: {
    type: 'string',
    example: 'image/png',
    description: 'MIME 类型',
  },
};
