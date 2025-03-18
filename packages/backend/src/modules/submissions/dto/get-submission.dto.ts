import { SchemaProp } from '../../../utils/schema-prop.util';

export const getSubmissionDtoProps: SchemaProp = {
  challengeId: {
    type: 'string',
    example: '1234556',
    description: '挑战ID',
  },
  userId: {
    type: 'string',
    example: '123456',
    description: '用户ID',
  },
  type: {
    type: 'string',
    example: 'execute',
    description: '提交类型',
  },
  score: {
    type: 'number',
    example: 30,
    default: -1,
    description: '得分，-1表示未评分',
  },
  correctRate: {
    type: 'number',
    example: 0.7,
    default: -1,
    description: '正确率，-1表示未评分',
  },
  status: {
    type: 'string',
    example: 'pending',
    default: 'pending',
    description: '判题状态',
  },
  message: {
    type: 'string',
    example: '提交成功',
    default: '',
    description: '消息',
  },
  screenshotIds: {
    type: 'array',
    example: ['123456', '123457'],
    items: {
      type: 'string',
      example: '123456',
    },
    default: [],
    description: '截图ID',
  },
  createdAt: {
    type: 'string',
    example: '2021-01-01T00:00:00.000Z',
    description: '提交时间',
  },
  solution: {
    type: 'number',
    example: 100,
    default: 0,
    description: '判题用时',
  },
};
