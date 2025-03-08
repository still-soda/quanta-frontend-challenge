import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ApiNeedAuth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';

export const TasksDoc = new ApiDocumentHelper({
  '/upload-flow-data': () => {
    return [
      ApiOperation({
        summary: '上传 Flow 数据',
        description:
          '会对挑战 ID 和用户 ID 进行校验，如果找不到对应的 Challenge 或 userId 不等于 Challenge 的 authorId，会抛出异常。',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            challengeId: { type: 'string', description: '挑战 ID' },
            data: { type: 'object', description: 'Flow 数据' },
          },
          required: ['challengeId', 'data'],
        },
      }),
      ApiResponse({
        status: 200,
        description: '上传成功',
        schema: responseSchema('ok', '上传成功'),
      }),
      ApiResponse({
        status: 400,
        description: '数据格式错误',
        schema: responseSchema('bad request', '数据格式错误'),
      }),
      ApiResponse({
        status: 403,
        description: '无权上传数据',
        schema: responseSchema('forbidden', '无权上传数据'),
      }),
      ApiResponse({
        status: 404,
        description: '找不到 Challenge',
        schema: responseSchema('not found', '找不到 Challenge'),
      }),
    ];
  },
  '/launch-pre-execute': () => {
    return [
      ApiOperation({
        summary: '启动预执行任务',
        description: '启动预执行任务',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            challengeId: { type: 'string', description: '挑战 ID' },
            submissionId: { type: 'string', description: '提交记录 ID' },
          },
          required: ['challengeId'],
        },
      }),
      ApiResponse({
        status: 201,
        description: '预执行任务创建成功',
        schema: responseSchema('created', '预执行任务创建成功'),
      }),
      ApiResponse({
        status: 400,
        description: '预执行任务创建失败',
        schema: responseSchema('bad request', '预执行任务创建失败'),
      }),
    ];
  },
  '/launch-execute': () => {
    return [
      ApiOperation({
        summary: '启动执行任务',
        description: '启动执行任务',
      }),
      ApiNeedAuth(),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            challengeId: { type: 'string', description: '挑战 ID' },
            submitFileId: { type: 'string', description: '提交记录 ID' },
          },
          required: ['challengeId'],
        },
      }),
      ApiResponse({
        status: 201,
        description: '执行任务创建成功',
        schema: responseSchema('created', '执行任务创建成功'),
      }),
      ApiResponse({
        status: 400,
        description: '执行任务创建失败',
        schema: responseSchema('bad request', '执行任务创建失败'),
      }),
    ];
  },
  '/prev-task-count/:submissionsId': () => {
    return [
      ApiOperation({
        summary: '订阅获取指定提交记录前排队的任务数量。',
        description: '使用 EventSource 订阅获取指定提交记录前排队的任务数量。',
      }),
      ApiNeedAuth(),
      ApiParam({
        name: 'submissionId',
        description: '提交记录 ID',
        required: true,
        schema: { type: 'string' },
      }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', description: '排队中的任务数量' },
          },
        },
      }),
      ApiResponse({
        status: 400,
        description: '找不到提交记录',
        schema: responseSchema('not found', '找不到提交记录'),
      }),
      ApiResponse({
        status: 403,
        description: '无权订阅',
        schema: responseSchema('forbidden', '无权订阅'),
      }),
    ];
  },
});
