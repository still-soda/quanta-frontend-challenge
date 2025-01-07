import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateChallengeDto {
  @ApiProperty({
    example: 'CSS Battle',
    description: '挑战名称',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'hard', description: '难度', required: false })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty({ example: 40, description: '分数', required: false })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({ example: 'css', description: '类型', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    description: '标签',
    required: false,
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: '1234567', description: '作者ID', required: false })
  @IsOptional()
  @IsString()
  authorId?: string;
}
