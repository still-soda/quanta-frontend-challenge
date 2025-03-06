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
  createdAt: {
    type: 'string',
    example: '2021-01-01T00:00:00.000Z',
    description: '提交时间',
  },
};
