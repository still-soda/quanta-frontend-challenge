import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { SchemaProp } from 'src/utils/schema-prop.util';

export class CreateChallengeDto {
  @ApiProperty({ example: 'CSS Battle', description: '挑战名称' })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ example: 'hard', description: '难度' })
  @IsString()
  @Expose()
  difficulty: string;

  @ApiProperty({ example: 40, description: '分数' })
  @IsNumber()
  @Expose()
  score: number;

  @ApiProperty({ example: 'css', description: '类型' })
  @IsString()
  @Expose()
  type: string;

  @ApiProperty({
    example: ['1.html', '2.html'],
    default: [],
    description: '标准答案文件名列表',
  })
  @IsOptional()
  @IsArray()
  @Expose()
  standardAnswer?: string[];

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    default: [],
    description: '标签',
  })
  @IsOptional()
  @IsArray()
  @Expose()
  tags?: string[];
}

export const createChallengeProps: SchemaProp = {
  title: {
    type: 'string',
    required: true,
    example: 'CSS Battle',
    description: '挑战名称',
  },
  difficulty: {
    type: 'string',
    required: true,
    example: 'hard',
    description: '难度',
  },
  score: {
    type: 'number',
    required: true,
    example: 40,
    description: '分数',
  },
  type: {
    type: 'string',
    required: true,
    example: 'css',
    description: '类型',
  },
  standardAnswer: {
    type: 'array',
    required: false,
    items: {
      type: 'string',
    },
    example: ['1.html', '2.html'],
    description: '标准答案文件名列表',
  },
  tags: {
    type: 'array',
    required: false,
    items: {
      type: 'string',
    },
    example: ['css', 'html', 'javascript'],
    description: '标签',
  },
};
