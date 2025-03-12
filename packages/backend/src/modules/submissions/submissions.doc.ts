import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiNeedAuth } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { getSubmissionDtoProps } from './dto/get-submission.dto';

export const SubmissionsDoc = new ApiDocumentHelper({
  '/my-submissions': () => {
    return [
      ApiOperation({ summary: '获取我的提交' }),
      ApiNeedAuth(),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: { type: 'object', properties: getSubmissionDtoProps },
        }),
      }),
    ];
  },
  '/one-submission': () => {
    return [
      ApiOperation({ summary: '根据ID获取我的某个提交' }),
      ApiNeedAuth(),
      ApiQuery({
        name: 'submissionId',
        type: 'string',
        description: '提交 ID',
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: getSubmissionDtoProps,
        }),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非管理员无权查看他人提交记录',
        schema: responseSchema('forbidden', '非管理员无权查看他人提交记录'),
      }),
    ];
  },
  '/someones-submissions': () => {
    return [
      ApiOperation({ summary: '获取某个用户的提交' }),
      ApiNeedAuth(),
      ApiQuery({ name: 'userId', type: 'string', description: '用户 ID' }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: { type: 'object', properties: getSubmissionDtoProps },
        }),
      }),
    ];
  },
  '/count': () => {
    return [
      ApiOperation({
        summary: '获取某个挑战的提交数量',
        description: '缓存 2 分钟',
      }),
      ApiQuery({ name: 'challengeId', type: 'string', description: '挑战 ID' }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: { count: { type: 'number' } },
        }),
      }),
    ];
  },
  '/passed-rate': () => {
    return [
      ApiOperation({
        summary: '获取某个挑战的通过率',
        description: '通过率 = 通过的提交数量 / 总提交数量；缓存 2 分钟',
      }),
      ApiQuery({ name: 'challengeId', type: 'string', description: '挑战 ID' }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: { rate: { type: 'number' } },
          example: { rate: 0.5 },
        }),
      }),
    ];
  },
  '/records': () => {
    return [
      ApiOperation({ summary: '获取某个挑战的提交记录' }),
      ApiQuery({ name: 'challengeId', type: 'string', description: '挑战 ID' }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: { type: 'object', properties: getSubmissionDtoProps },
        }),
      }),
    ];
  },
  '/my-submissions-in-challenge': () => {
    return [
      ApiOperation({ summary: '获取用户在某个挑战的提交记录' }),
      ApiQuery({ name: 'challengeId', type: 'string', description: '挑战 ID' }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: { type: 'object', properties: getSubmissionDtoProps },
        }),
      }),
    ];
  },
});
