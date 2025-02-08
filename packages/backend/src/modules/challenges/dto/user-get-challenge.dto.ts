import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SchemaProp } from 'src/utils/schema-prop.util';

/**
 * 用户获取挑战的 DTO，比完整的文档的少一些字段
 */
export class UserGetChallengeDto {
  @ApiProperty({
    example: '1234567',
    description: '挑战ID',
    required: true,
  })
  @Expose()
  id?: string;

  @ApiProperty({
    example: 'CSS Battle',
    description: '挑战名称',
    required: true,
  })
  @Expose()
  title: string;

  @ApiProperty({ example: 'hard', description: '难度', required: true })
  @Expose()
  difficulty: string;

  @ApiProperty({ example: 40, description: '分数', required: true })
  @Expose()
  score: number;

  @ApiProperty({ example: 'css', description: '类型', required: true })
  @Expose()
  type: string;

  @ApiProperty({
    example: ['css', 'html', 'javascript'],
    default: [],
    description: '标签',
    required: false,
  })
  @Expose()
  tags: string[];
}

/**
 * 用户获取挑战的 DTO 的属性
 */
export const userGetChallengeProps: SchemaProp = {
  id: {
    type: 'string',
    description: '挑战ID',
    example: '1234567',
    required: false,
  },
  title: {
    type: 'string',
    description: '挑战名称',
    example: 'CSS Battle',
    required: true,
  },
  difficulty: {
    type: 'string',
    description: '难度',
    example: 'hard',
    required: true,
  },
  score: {
    type: 'number',
    description: '分数',
    example: 40,
    required: true,
  },
  type: {
    type: 'string',
    description: '类型',
    example: 'css',
    required: true,
  },
  tags: {
    type: 'array',
    description: '标签',
    items: {
      type: 'string',
    },
    example: ['css', 'html', 'javascript'],
  },
};
