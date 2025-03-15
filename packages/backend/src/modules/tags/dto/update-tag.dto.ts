import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsHexColor,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: '标签名',
    example: '前端',
    required: true,
  })
  @IsOptional()
  @MinLength(1)
  @IsString()
  @Expose()
  name?: string;

  @ApiProperty({
    description: '描述',
    example: '前端开发相关',
    default: '',
    required: false,
  })
  @IsOptional()
  @MaxLength(100)
  @IsString()
  @Expose()
  description?: string;

  @ApiProperty({
    description: '颜色',
    example: '#D4D5D9',
    default: '#D4D5D9',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  @Expose()
  color?: string;
}
