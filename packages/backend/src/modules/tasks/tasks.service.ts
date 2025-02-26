import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TaskJobData } from './tasks.processor';
import { SubmissionsService } from '../submissions/submissions.service';
import { ChallengesService } from '../challenges/challenges.service';
import { UsersService } from '../users/users.service';
import { ActionsService } from '../actions/actions.service';

interface ExecuteTasksOptions {
  challengeId: string;
  submitFileId: string;
  userId: string;
}

interface PreExecuteTasksOptions {
  challengeId: string;
  userId: string;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue<TaskJobData>,
    private readonly submissionsService: SubmissionsService,
    private readonly challengesService: ChallengesService,
    private readonly usersService: UsersService,
    private readonly actionsService: ActionsService
  ) { }

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
   * - `Error`: 找不到 Challenge
   * - `Error`: 找不到 User
   */
  async pushExecuteJob(options: ExecuteTasksOptions) {
    const { challengeId, userId, submitFileId } = options;

    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw new Error('找不到 Challenge');
    }

    if (!(await this.usersService.findOne(userId))) {
      throw new Error('找不到 User');
    }

    const { id: submissionId } = await this.submissionsService.create({
      challengeId,
      userId,
      type: 'execute',
    });

    // 记录 Action
    await this.actionsService.create({
      type: 'commit',
      title: `提交了 ${challenge.title} 的答案`,
      payload: { challengeId, submissionId },
      userId,
    }, { id: userId, role: 0, username: undefined });

    return await this.tasksQueue.add('execute', {
      challengeId,
      submissionId,
      submitFileId,
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
   * - `Error`: 找不到 Challenge
   * - `Error`: 找不到 User
   */
  async pushPreExecuteJob(options: PreExecuteTasksOptions) {
    const { challengeId, userId } = options;

    if (!(await this.challengesService.findOne(challengeId))) {
      throw new Error('找不到 Challenge');
    }

    if (!(await this.usersService.findOne(userId))) {
      throw new Error('找不到 User');
    }

    const { id: submissionId } = await this.submissionsService.create({
      challengeId,
      userId,
      type: 'preExecute',
    });

    return await this.tasksQueue.add('preExecute', {
      challengeId,
      submissionId,
    });
  }
}
