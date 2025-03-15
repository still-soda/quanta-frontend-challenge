import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { getTagDtoProps } from './dto/get-tag.dto';
import { responseSchema } from 'src/utils/http-response.utils';

export const TagsDoc = new ApiDocumentHelper({
  '/create': () => {
    return [
      ApiOperation({
        summary: '创建标签',
        description: '创建标签',
      }),
      ApiBody({
        type: 'CreateTagDto',
      }),
      ApiResponse({
        status: 201,
        description: '创建成功',
        schema: responseSchema('created', '创建成功', {
          type: 'object',
          properties: getTagDtoProps,
        }),
      }),
    ];
  },
  '/find-all': () => {
    return [
      ApiOperation({
        summary: '获取所有标签',
        description: '获取所有标签',
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: getTagDtoProps,
          },
        }),
      }),
    ];
  },
  '/find-one': () => {
    return [
      ApiOperation({
        summary: '获取标签',
        description: '获取标签',
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: getTagDtoProps,
        }),
      }),
    ];
  },
  '/update': () => {
    return [
      ApiOperation({
        summary: '更新标签',
        description: '更新标签',
      }),
      ApiBody({
        type: 'UpdateTagDto',
      }),
      ApiResponse({
        status: 200,
        description: '更新成功',
        schema: responseSchema('ok', '更新成功', {
          type: 'object',
          properties: getTagDtoProps,
        }),
      }),
    ];
  },
  '/delete': () => {
    return [
      ApiOperation({
        summary: '删除标签',
        description: '删除标签',
      }),
      ApiResponse({
        status: 200,
        description: '删除成功',
        schema: responseSchema('ok', '删除成功'),
      }),
    ];
  },
  '/find-by-creator': () => {
    return [
      ApiOperation({
        summary: '获取创建的标签',
        description: '获取创建的标签',
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: getTagDtoProps,
          },
        }),
      }),
    ];
  },
});
