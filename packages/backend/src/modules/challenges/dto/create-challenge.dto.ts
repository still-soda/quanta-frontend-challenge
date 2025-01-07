import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ example: 'CSS Battle', description: '挑战名称' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'hard', description: '难度' })
  @IsString()
  difficulty: string;

  @ApiProperty({ example: 40, description: '分数' })
  @IsNumber()
  score: number;

  @ApiProperty({ example: 'css', description: '类型' })
  @IsString()
  type: string;

  @ApiProperty({
    example: ['1.html', '2.html'],
    default: [],
    description: '标准答案文件名列表',
  })
  @IsOptional()
  @IsArray()
  standardAnswer?: string[];

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    default: [],
    description: '标签',
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: '1234567', description: '作者ID' })
  @IsString()
  authorId: string;
}
