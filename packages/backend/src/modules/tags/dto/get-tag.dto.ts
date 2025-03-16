import { SchemaProp } from '../../../utils/schema-prop.util';

export const getTagDtoProps: SchemaProp = {
  id: {
    type: 'string',
    example: '60d8f5c7d1c3d5f2d9e4c7f3',
    description: '标签ID',
  },
  name: {
    type: 'string',
    example: '前端',
    description: '标签名',
  },
  description: {
    type: 'string',
    example: '前端开发相关',
    description: '描述',
  },
  color: {
    type: 'string',
    example: '#D4D5D9',
    description: '颜色',
  },
  creatorId: {
    type: 'string',
    example: '60d8f5c7d1c3d5f2d9e4c7f3',
    description: '创建者ID',
  },
  createdAt: {
    type: 'string',
    example: '2021-06-28T06:23:35.000Z',
    description: '创建时间',
  },
  updatedAt: {
    type: 'string',
    example: '2021-06-28T06:23:35.000Z',
    description: '更新时间',
  },
  icon: {
    type: 'string',
    example: 'icon',
    description: '图标',
    required: false,
  },
};
