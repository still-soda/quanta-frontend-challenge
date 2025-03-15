import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { responseSchema } from 'src/utils/http-response.utils';
import { getResolvedChallengeDtoProps } from './dto/get-resolved-challenge.dto';

export const ResolvedDoc = new ApiDocumentHelper({
  '/earliest-three-of-challenge': () => {
    return [
      ApiOperation({
        summary: '获取挑战的前三名解决记录',
        description: '获取挑战的前三名解决记录',
        parameters: [
          {
            in: 'query',
            name: 'challengeId',
            required: true,
            description: '挑战 ID',
            schema: { type: 'string' },
          },
        ],
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: getResolvedChallengeDtoProps,
          },
        }),
      }),
    ];
  },
  '/earliest-of-user': () => {
    return [
      ApiOperation({
        summary: '获取用户解决记录中是前三名的记录',
        description: '获取用户解决记录中是前三名的记录',
        parameters: [
          {
            in: 'query',
            name: 'userId',
            required: true,
            description: '用户 ID',
            schema: { type: 'string' },
          },
        ],
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: getResolvedChallengeDtoProps,
          },
        }),
      }),
    ];
  },
  '/by-challenge-id': () => {
    return [
      ApiOperation({
        summary: '获取挑战的解决记录',
        description: '获取挑战的解决记录',
        parameters: [
          {
            in: 'query',
            name: 'challengeId',
            required: true,
            description: '挑战ID',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'page',
            required: false,
            description: '页数',
            schema: { type: 'number' },
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            description: '每页数量',
            schema: { type: 'number' },
          },
        ],
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: getResolvedChallengeDtoProps,
          },
        }),
      }),
    ];
  },
  '/by-user-id': () => {
    return [
      ApiOperation({
        summary: '获取用户的解决记录',
        description: '获取用户的解决记录',
        parameters: [
          {
            in: 'query',
            name: 'userId',
            required: true,
            description: '用户ID',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'page',
            required: false,
            description: '页数',
            schema: { type: 'number' },
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            description: '每页数量',
            schema: { type: 'number' },
          },
        ],
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: getResolvedChallengeDtoProps,
          },
        }),
      }),
    ];
  },
});
