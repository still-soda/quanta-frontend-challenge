import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateChallengeDto {
  @ApiProperty({
    example: 'CSS Battle',
    description: '挑战名称',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({
    example: '挑战内容',
    description: '挑战内容',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  content?: string;

  @ApiProperty({ example: 'hard', description: '难度', required: false })
  @IsOptional()
  @IsString()
  @Expose()
  difficulty?: string;

  @ApiProperty({ example: 40, description: '分数', required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  score?: number;

  @ApiProperty({ example: 'css', description: '类型', required: false })
  @IsOptional()
  @IsString()
  @Expose()
  type?: string;

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    description: '标签',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Expose()
  tags?: string[];
}
