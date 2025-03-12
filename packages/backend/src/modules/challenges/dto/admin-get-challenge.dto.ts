import { SchemaProp } from '../../../utils/schema-prop.util';

/**
 * 管理员获取挑战的 DTO 的属性
 */
export const adminGetChallengeProps: SchemaProp = {
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
  authorId: {
    type: 'string',
    description: '作者ID',
    example: '1234567',
    required: true,
  },
  createdAt: {
    type: 'string',
    description: '创建时间',
    example: '2021-01-01T00:00:00.000Z',
    required: true,
  },
  updatedAt: {
    type: 'string',
    description: '更新时间',
    example: '2021-01-01T00:00:00.000Z',
    required: true,
  },
  status: {
    type: 'number',
    description:
      '挑战状态，可选值为 0:draft, 1:ready, 2:published, 3:closed\n' +
      '分别表示草稿（预执行未执行或未通过）、准备中、已发布、已关闭',
    enum: [0, 1, 2, 3],
    example: 0,
    required: true,
  } as any,
  totalSubmissions: {
    type: 'number',
    description: '总提交次数',
    example: 123,
    required: true,
  },
  totalPass: {
    type: 'number',
    description: '总通过次数',
    example: 12,
    required: true,
  },
  contentId: {
    type: 'string',
    description: '内容文件ID',
    example: '1234567',
    required: true,
  },
  flowdataId: {
    type: 'string',
    description: '流程数据ID',
    example: '1234567',
    required: false,
  },
  standardAnswer: {
    type: 'array',
    description: '标准答案文件 ID 列表',
    items: {
      type: 'string',
    },
    example: ['1bxxx1', '2bxxx2', '3bxxx3'],
  },
  answerTemplate: {
    type: 'array',
    description: '用户作答模板文件 ID 列表',
    items: {
      type: 'string',
    },
    example: ['1bxxx1', '2bxxx2', '3bxxx3'],
  },
  screenshots: {
    type: 'array',
    description: '截图文件 ID 列表',
    items: {
      type: 'string',
    },
    example: ['1bxxx1', '2bxxx2', '3bxxx3'],
  },
  fastestSolvers: {
    type: 'array',
    description: '最快的前3个解决者',
    items: {
      type: 'string',
    },
    example: ['username'],
  },
};
