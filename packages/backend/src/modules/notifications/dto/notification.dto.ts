import { SchemaProp } from '../../../utils/schema-prop.util';

export const notifacationProp: SchemaProp = {
  title: {
    type: 'string',
    description: '标题',
    required: true,
    example: 'Solve Challenge',
  },
  description: {
    type: 'string',
    description: '简介',
    required: true,
    example: '这是公告简介',
  },
  authorId: {
    type: 'string',
    description: '作者ID',
    required: true,
    example: '123456',
  },
  contentId: {
    type: 'string',
    description: '文章ID',
    required: true,
    example: '123456',
  },
  coverUrl: {
    type: 'string',
    description: '封面链接',
    example: 'https://www.gravatar.com/avatar/',
    required: false,
  },
};
