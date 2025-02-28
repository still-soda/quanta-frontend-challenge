import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import {
  ExecuteTasksOptions,
  PreExecuteTasksOptions,
  TasksService,
} from './tasks.service';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import {
  ApiNeedAuth,
  Auth,
  ROLE,
} from '../../common/decorators/auth.decorator';
import {
  responseError,
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';
import { IpLimit } from '../../common/decorators/ip-limit.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface UploadFlowDataBody {
  challengeId: string;
  data: any;
}

type WithoutUserId<T> = Omit<T, 'userId'>;

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * 上传 Flow 数据。
   *
   * 会对挑战 ID 和用户 ID 进行校验，如果找不到对应的 Challenge 或
   * userId 不等于 Challenge 的 authorId，会抛出异常。
   * @param user 用户数据
   * @param body 请求体
   * @returns 上传成功
   * @throws
   * - `not found`: 找不到 Challenge
   * - `forbidden`: 无权上传数据
   * - `bad request`: 数据格式错误
   * - `internal server error`: 上传失败
   */
  @ApiOperation({
    summary: '上传 Flow 数据',
    description:
      '会对挑战 ID 和用户 ID 进行校验，如果找不到对应的 Challenge 或 userId 不等于 Challenge 的 authorId，会抛出异常。',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        challengeId: { type: 'string', description: '挑战 ID' },
        data: { type: 'object', description: 'Flow 数据' },
      },
      required: ['challengeId', 'data'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '上传成功',
    schema: responseSchema('ok', '上传成功'),
  })
  @ApiResponse({
    status: 400,
    description: '数据格式错误',
    schema: responseSchema('bad request', '数据格式错误'),
  })
  @ApiResponse({
    status: 403,
    description: '无权上传数据',
    schema: responseSchema('forbidden', '无权上传数据'),
  })
  @ApiResponse({
    status: 404,
    description: '找不到 Challenge',
    schema: responseSchema('not found', '找不到 Challenge'),
  })
  @HttpCode(200)
  @Post('upload-flow-data')
  @Auth(ROLE.ADMIN)
  @IpLimit()
  async uploadFlowData(
    @CurrentUser() user: UserData,
    @Body() body: UploadFlowDataBody,
  ) {
    const { challengeId, data } = body;
    const { id: userId } = user;
    await this.tasksService.uploadFlowData(challengeId, userId, data);

    return responseSuccess('ok', {}, '上传成功');
  }

  /**
   * 启动预执行任务。
   * @param user 用户数据
   * @param body 请求体
   * - `challengeId` 挑战 ID
   * @returns 预执行任务创建成功
   * @throws
   * - `not found`: 找不到 Challenge
   * - `not found`: 找不到预执行任务
   * - `bad request`: 预执行任务创建失败
   */
  @ApiOperation({
    summary: '启动预执行任务',
    description: '启动预执行任务',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        challengeId: { type: 'string', description: '挑战 ID' },
      },
      required: ['challengeId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '预执行任务创建成功',
    schema: responseSchema('created', '预执行任务创建成功'),
  })
  @ApiResponse({
    status: 400,
    description: '预执行任务创建失败',
    schema: responseSchema('bad request', '预执行任务创建失败'),
  })
  @HttpCode(201)
  @Post('launch-pre-execute')
  @Auth(ROLE.ADMIN)
  @IpLimit()
  async launchPreExecute(
    @CurrentUser() user: UserData,
    @Body() body: WithoutUserId<PreExecuteTasksOptions>,
  ) {
    let jobId: string;

    try {
      const { id } = await this.tasksService.pushPreExecuteJob({
        ...body,
        userId: user.id,
      });
      jobId = id.toString();
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw responseError('bad request', { msg: error.message });
      }
      throw error;
    }

    return responseSuccess('created', { jobId }, '预执行任务创建成功');
  }

  /**
   * 启动执行任务。
   * @param user 用户数据
   * @param body 请求体
   * - `challengeId` 挑战 ID
   * @returns 执行任务创建成功
   * @throws
   * - `bad request`: 执行任务创建失败
   */
  @ApiOperation({
    summary: '启动执行任务',
    description: '启动执行任务',
  })
  @ApiNeedAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        challengeId: { type: 'string', description: '挑战 ID' },
      },
      required: ['challengeId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '执行任务创建成功',
    schema: responseSchema('created', '执行任务创建成功'),
  })
  @ApiResponse({
    status: 400,
    description: '执行任务创建失败',
    schema: responseSchema('bad request', '执行任务创建失败'),
  })
  @HttpCode(201)
  @Post('launch-execute')
  @Auth()
  @IpLimit()
  async launchExecute(
    @CurrentUser() user: UserData,
    @Body() body: WithoutUserId<ExecuteTasksOptions>,
  ) {
    let jobId: string;

    try {
      const { id } = await this.tasksService.pushExecuteJob({
        ...body,
        userId: user.id,
      });
      jobId = id.toString();
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw responseError('bad request', { msg: error.message });
      }
      throw error;
    }

    return responseSuccess('created', { jobId }, '执行任务创建成功');
  }
}
