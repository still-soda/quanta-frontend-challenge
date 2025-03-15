import { SchemaProp } from 'src/utils/schema-prop.util';

export const getResolvedChallengeDtoProps: SchemaProp = {
  id: {
    type: 'string',
    description: 'ID',
    example: '60b0c0c3f9b5c7001f9b5c7',
    required: true,
  },
  challengeId: {
    type: 'string',
    description: '挑战 ID',
    example: '60b0c0c3f9b5c7001f9b5c7',
    required: true,
  },
  userId: {
    type: 'string',
    description: '用户 ID',
    example: '60b0c0c3f9b5c7001f9b5c7',
    required: true,
  },
  resolvedAt: {
    type: 'string',
    description: '解决时间',
    example: '2021-05-28T09:00:00.000Z',
    required: true,
  },
  solution: {
    type: 'string',
    description: '解决用时',
    example: '1',
    required: true,
  },
  rank: {
    type: 'number',
    description: '解决排名',
    example: 1,
    required: true,
  },
};
