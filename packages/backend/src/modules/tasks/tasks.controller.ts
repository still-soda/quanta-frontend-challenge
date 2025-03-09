import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  MessageEvent,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import {
  ExecuteTasksOptions,
  PreExecuteTasksOptions,
  TasksService,
} from './tasks.service';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { Auth, ROLE } from '../../common/decorators/auth.decorator';
import {
  responseError,
  responseSuccess,
} from '../../utils/http-response.utils';
import { IpLimit } from '../../common/decorators/ip-limit.decorator';
import { TasksDoc } from './tasks.doc';
import { defer, from, map, Observable, switchMap } from 'rxjs';

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
  @TasksDoc.forRoute('/upload-flow-data')
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
  @TasksDoc.forRoute('/launch-pre-execute')
  @HttpCode(201)
  @Post('launch-pre-execute')
  @Auth(ROLE.ADMIN)
  @IpLimit()
  async launchPreExecute(
    @CurrentUser() user: UserData,
    @Body() body: WithoutUserId<PreExecuteTasksOptions>,
  ) {
    let jobId: string;
    let submissionId: string;

    try {
      const result = await this.tasksService.pushPreExecuteJob({
        ...body,
        userId: user.id,
      });
      jobId = result.id.toString();
      submissionId = result.data.submissionId;
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw responseError('bad request', { msg: error.message });
      }
      throw error;
    }

    return responseSuccess(
      'created',
      { jobId, submissionId },
      '预执行任务创建成功',
    );
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
  @TasksDoc.forRoute('/launch-execute')
  @HttpCode(201)
  @Post('launch-execute')
  @Auth()
  @IpLimit()
  async launchExecute(
    @CurrentUser() user: UserData,
    @Body() body: WithoutUserId<ExecuteTasksOptions>,
  ) {
    let jobId: string;
    let submissionId: string;

    try {
      const result = await this.tasksService.pushExecuteJob({
        ...body,
        userId: user.id,
      });
      jobId = result.id.toString();
      submissionId = result.data.submissionId;
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw responseError('bad request', { msg: error.message });
      }
      throw error;
    }

    return responseSuccess(
      'created',
      { jobId, submissionId },
      '执行任务创建成功',
    );
  }

  /**
   * 订阅获取指定提交记录前排队的任务数量。
   * @param submissionsId 提交记录 ID
   * @param user 用户数据
   * @returns 一个 Observable，每秒发送一次前排队的任务数量
   * @throws
   * - `not found`: 找不到提交记录
   */
  @TasksDoc.forRoute('/subscribe-prev-task-count/:submissionsId')
  @Sse('/subscribe-prev-task-count/:submissionsId')
  @Auth()
  async subscribePrevTaskCount(
    @Param('submissionsId') submissionsId: string,
    @CurrentUser() user: UserData,
  ): Promise<Observable<MessageEvent>> {
    const subject = await this.tasksService.getPrevTaskCountSubject(
      submissionsId,
      user,
    );
    return subject.pipe(map((count) => ({ data: count.toString() })));
  }
}
