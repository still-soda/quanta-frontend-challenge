import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({
    example: 'CSS Battle',
    description: '挑战名称',
    required: true,
  })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ example: 'hard', description: '难度', required: true })
  @IsString()
  @Expose()
  difficulty: string;

  @ApiProperty({ example: 40, description: '分数', required: true })
  @IsNumber()
  @Expose()
  score: number;

  @ApiProperty({ example: 'content', description: '内容', required: true })
  @IsString()
  @Expose()
  content: string;

  @ApiProperty({ example: 'css', description: '类型', required: true })
  @IsString()
  @Expose()
  type: string;

  @ApiProperty({
    example: ['1.html', '2.html'],
    default: [],
    description: '标准答案文件名列表',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Expose()
  standardAnswer?: string[];

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    default: [],
    description: '标签',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Expose()
  tags?: string[];
}
