import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { getTagDtoProps } from './dto/get-tag.dto';
import { responseSchema } from 'src/utils/http-response.utils';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiNeedAuth, ROLE } from '../../common/decorators/auth.decorator';

export const TagsDoc = new ApiDocumentHelper({
  '/create': () => {
    return [
      ApiOperation({
        summary: '创建标签',
        description: '创建标签',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiBody({
        type: CreateTagDto,
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
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiBody({
        type: UpdateTagDto,
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
      ApiNeedAuth({ level: ROLE.ADMIN }),
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
  '/find-by-ids': () => {
    return [
      ApiOperation({
        summary: '根据ID数组获取标签',
        description: '根据ID数组获取标签',
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
