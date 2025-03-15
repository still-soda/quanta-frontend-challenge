import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { TaskJobData } from './tasks.processor';
import { SubmissionsService } from '../submissions/submissions.service';
import { ChallengesService } from '../challenges/challenges.service';
import { UsersService } from '../users/users.service';
import { ActionsService } from '../actions/actions.service';
import { responseError } from '../../utils/http-response.utils';
import { JudgementsService } from '../judgements/judgements.service';
import { CounterService } from '../counter/counter.service';
import { CachesService } from '../caches/caches.service';
import { map, Subject, throttleTime } from 'rxjs';
import { UserData } from '../../common/decorators/user.decorator';
import { ROLE } from '../../common/decorators/auth.decorator';
import { ConfigService } from '@nestjs/config';
import { FlowData } from '../judgements/core/flow-data';

export interface ExecuteTasksOptions {
  challengeId: string;
  submitFileId: string;
  userId: string;
}

export interface PreExecuteTasksOptions {
  challengeId: string;
  userId: string;
}

export const DONE_TASK_ORDER_KEY = 'doneTaskOrder';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly prevTaskCountSubject = new Subject<number>();
  private readonly TASK_COUNT_PUSH_INTERVAL: number;

  constructor(
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue<TaskJobData>,
    private readonly submissionsService: SubmissionsService,
    private readonly challengesService: ChallengesService,
    private readonly usersService: UsersService,
    private readonly actionsService: ActionsService,
    private readonly judgementsService: JudgementsService,
    private readonly counterService: CounterService,
    private readonly cachesService: CachesService,
    private readonly configService: ConfigService,
  ) {
    this.TASK_COUNT_PUSH_INTERVAL =
      this.configService.get<number>('TASK_COUNT_PUSH_INTERVAL') ?? 500;
  }

  /**
   * 初始化时，将已完成的任务序号存入缓存。
   */
  async onModuleInit() {
    const doneTaskOrder =
      await this.counterService.currentValue(DONE_TASK_ORDER_KEY);
    this.cachesService.set(DONE_TASK_ORDER_KEY, doneTaskOrder);
  }

  /**
   * 上传 Flow 数据。
   *
   * 会对挑战 ID 和用户 ID 进行校验，如果找不到对应的 Challenge 或
   * userId 不等于 Challenge 的 authorId，会抛出异常。
   *
   * @param challengeId 挑战 ID
   * @param userId 用户 ID
   * @param flowData Flow 数据
   * @returns 是否上传成功
   * @throws
   * - `not found`: 找不到 Challenge
   * - `forbidden`: 无权上传数据
   * - `bad request`: 数据格式错误
   * - `internal server error`: 上传失败
   */
  async uploadFlowData(
    challengeId: string,
    userId: string,
    flowDataJSON: string,
  ) {
    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw responseError('not found', { msg: '找不到 Challenge' });
    }

    if (challenge.authorId !== userId) {
      throw responseError('forbidden', { msg: '无权上传数据' });
    }

    let flowData: FlowData[];
    try {
      flowData = JSON.parse(flowDataJSON);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    let result: Awaited<ReturnType<JudgementsService['serializeFlowData']>>;
    try {
      result = await this.judgementsService.serializeFlowData(challengeId, {
        data: flowData,
      });
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    if (!result.ok) {
      throw responseError('internal server error', {
        msg: '序列化数据失败',
        withoutStack: false,
      });
    }

    return result.ok;
  }

  /**
   * 推送执行任务到队列。
   *
   * 会对挑战 ID 和用户 ID 进行校验，如果找不到对应的 Challenge 或 User，
   * 会抛出异常。（等到任务执行时会对挑战再进行一次校验，
   * 避免中间删除导致错误的情况）
   *
   * @param options
   * - `challengeId`: 挑战 ID
   * - `submitFileId`: 提交文件 ID
   * - `userId`: 用户 ID
   * @returns 任务 ID
   * @throws
   * - `not found`: 找不到 Challenge
   * - `not found`: 找不到 User
   */
  async pushExecuteJob(options: ExecuteTasksOptions) {
    const { challengeId, userId, submitFileId } = options;

    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw responseError('not found', { msg: '找不到 Challenge' });
    }

    if (!(await this.usersService.findOne(userId))) {
      throw responseError('not found', { msg: '找不到 User' });
    }

    const { id: submissionId } = await this.submissionsService.create({
      challengeId,
      userId,
      type: 'execute',
    });

    // 记录 Action
    await this.actionsService.create(
      {
        type: 'commit',
        title: `提交了 ${challenge.title} 的答案`,
        payload: { challengeId, submissionId },
        userId,
      },
      { id: userId, role: 0, username: undefined },
    );

    return await this.tasksQueue.add('execute', {
      challengeId,
      submissionId,
      submitFileId,
      startAt: Date.now(),
    });
  }

  /**
   * 推送预执行任务到队列。
   *
   * 会对挑战 ID 和用户 ID 进行校验，如果找不到对应的 Challenge 或 User，
   * 会抛出异常。（等到任务执行时会对挑战再进行一次校验，
   * 避免中间删除导致错误的情况）
   *
   * @param options
   * - `challengeId`: 挑战 ID
   * - `userId`: 用户 ID
   * @returns 任务 ID
   * @throws
   * - `not found`: 找不到 Challenge
   * - `not found`: 找不到 User
   */
  async pushPreExecuteJob(options: PreExecuteTasksOptions) {
    const { challengeId, userId } = options;

    if (!(await this.challengesService.findOne(challengeId))) {
      throw responseError('not found', { msg: '找不到 Challenge' });
    }

    if (!(await this.usersService.findOne(userId))) {
      throw responseError('not found', { msg: '找不到 User' });
    }

    const { id: submissionId } = await this.submissionsService.create({
      challengeId,
      userId,
      type: 'preExecute',
    });

    return await this.tasksQueue.add('preExecute', {
      challengeId,
      submissionId,
      startAt: Date.now(),
    });
  }

  /**
   * 获取前方排队中的任务数量的 Observable 对象。
   * @param submissionId 提交 ID
   * @param user 用户数据
   * @returns Observable 对象
   * @throws
   * - `not found`: 找不到提交记录
   * - `forbidden`: 无权订阅
   */
  async getPrevTaskCountSubject(submissionId: string, user: UserData) {
    const submission = await this.submissionsService.findOne(submissionId);

    if (!submission) {
      throw responseError('not found', { msg: '找不到提交记录' });
    }

    if (submission.userId !== user.id && user.role < ROLE.ADMIN) {
      throw responseError('forbidden', { msg: '无权订阅' });
    }

    const { order } = submission;
    return this.prevTaskCountSubject
      .pipe(throttleTime(this.TASK_COUNT_PUSH_INTERVAL))
      .pipe(map((doneTaskCount: number) => Math.max(order - doneTaskCount, 0)));
  }

  /**
   * 更新前方排队中的任务数量。
   * @param doneTaskCount 当前任务序号
   * @returns 前方排队中的任务数量
   */
  async increasePrevTaskCount() {
    const doneTaskCount = await this.cachesService.incr(DONE_TASK_ORDER_KEY);
    this.prevTaskCountSubject.next(doneTaskCount);
    await this.cachesService.set(DONE_TASK_ORDER_KEY, doneTaskCount);
  }
}
