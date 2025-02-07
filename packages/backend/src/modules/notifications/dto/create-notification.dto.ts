import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Solve Challenge',
    description: '标题',
    required: true,
  })
  @IsString()
  @MaxLength(50, { message: '标题长度不能超过50' })
  @MinLength(5, { message: '标题长度不能少于5' })
  @Expose()
  title: string;

  @ApiProperty({
    example: '这是公告简介',
    description: '简介',
    required: true,
  })
  @IsString()
  @MaxLength(200, { message: '简介长度不能超过200' })
  @MinLength(10, { message: '简介长度不能少于10' })
  @Expose()
  description: string;

  @ApiProperty({
    example: '123456',
    description: '作者ID',
    required: true,
  })
  @IsString()
  @Expose()
  authorId: string;

  @ApiProperty({
    example: '文章内容',
    description: '文章内容',
    required: true,
  })
  @IsString()
  @Expose()
  content: string;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/',
    description: '封面链接',
  })
  @IsOptional()
  @IsString()
  @Expose()
  coverUrl?: string;
}
