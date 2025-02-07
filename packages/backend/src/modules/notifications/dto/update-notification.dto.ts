import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    example: 'Solve Challenge',
    description: '标题',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '标题长度不能超过50' })
  @MinLength(5, { message: '标题长度不能少于5' })
  @Expose()
  title?: string;

  @ApiProperty({
    example: '这是公告简介',
    description: '简介',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '简介长度不能超过200' })
  @MinLength(10, { message: '简介长度不能少于10' })
  @Expose()
  description?: string;

  @ApiProperty({
    example: '文章内容',
    description: '文章内容',
  })
  @IsOptional()
  @IsString()
  @Expose()
  content?: string;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '封面链接',
  })
  @IsOptional()
  @IsString()
  @Expose()
  coverUrl?: string;
}
