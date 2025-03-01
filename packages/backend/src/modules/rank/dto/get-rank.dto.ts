import { SchemaProp } from '../../../utils/schema-prop.util';

export const getRankDtoProps: SchemaProp = {
  userId: {
    type: 'string',
    description: '用户ID',
    example: '1234567',
  },
  score: {
    type: 'number',
    description: '分数',
    example: 100,
  },
  rank: {
    type: 'number',
    description: '排名',
    example: 1,
  },
  time: {
    type: 'string',
    description: '时间',
    example: '2021-10-01T00:00:00.000Z',
  },
};
