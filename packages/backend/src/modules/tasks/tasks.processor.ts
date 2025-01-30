import {
  Process,
  Processor,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import {
  ExecuteResult,
  JudgementsService,
} from '../judgements/judgements.service';
import { Logger } from '@nestjs/common';
import { SubmissionsService } from '../submissions/submissions.service';
import { SubmissionType } from 'src/schemas/submissions.schema';

export type TaskJob = Job<{
  challengeId: string;
  submissionId: string;
  submitFileId?: string;
}>;

export type TaskJobData = TaskJob['data'];

export type ProcessResult = {
  passed: boolean;
  type: SubmissionType;
};

/**
 * 生成一个徽章字符串。
 * @example
 * ```ts
 * badge('execute')     // => '[Execute]'
 * badge('preExecute')  // => '[PreExecute]'
 * ```
 */
const badge = (str: string) =>
  `[${str.toUpperCase().slice(0, 1)}${str.toLowerCase().slice(1)}]`;

@Processor('tasks')
export class TasksProcessor {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(
    private readonly judgementsService: JudgementsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  /**
   * 消费任务然后执行，并更新提交记录的状态、分数、正确率和消息。
   *
   * 该方法首先会检查任务数据中是否包含 `submissionId` 和 `submitFileId`，
   * 如果不存在则抛出错误。然后会根据 `submissionId` 查询提交记录，
   * 如果不存在则抛出错误。
   *
   * 接着调用 `JudgementsService.execute` 方法执行评测，获取评测结果。
   *
   * 最后更新提交记录的状态、分数、正确率和消息。
   *
   * @param job 任务
   * - `challengeId`: 挑战 ID
   * - `submissionId`: 提交记录 ID
   * - `submitFileId`: 提交文件 ID
   * @returns 一个对象，包含是否通过和提交类型
   * - `passed`: 是否通过
   * - `type`: 提交类型，如 `execute` 或 `preExecute`
   * @throws
   * - `Error`: 需要 `submissionId`
   * - `Error`: 需要 `submitFileId`
   * - `Error`: 提交记录不存在
   */
  @Process({
    name: 'execute',
    concurrency: Number(process.env.MAX_EXECUTE_CONCURRENCY ?? 2),
  })
  async handleExecute(job: TaskJob): Promise<ProcessResult> {
    const { submissionId, submitFileId, challengeId } = job.data;

    if (!submitFileId) {
      throw new Error('需要 submitFileId');
    }

    if (!submissionId) {
      throw new Error('需要 submissionId');
    }

    const submission = await this.submissionsService.findOne(submissionId);
    if (!submission) {
      throw new Error('提交记录不存在');
    }

    const result: ExecuteResult = await this.judgementsService.execute(
      challengeId,
      submitFileId,
    );

    const resultMsg = JSON.stringify(result.result);
    await this.submissionsService.update(submissionId, {
      status: result.passed ? 'passed' : 'failed',
      score: result.score,
      correctRate: result.score / result.totalScore,
      message: resultMsg,
    });

    return { passed: result.passed, type: submission.type };
  }

  /**
   * 消费任务然后执行预评测，并更新提交记录的状态、分数、正确率和消息。
   *
   * 该方法首先会检查任务数据中是否包含 `submissionId`，
   * 如果不存在则抛出错误。然后会根据 `submissionId` 查询提交记录，
   *
   * 接着调用 `JudgementsService.preExecute` 方法执行预评测，获取评测结果。
   *
   * 最后更新提交记录的状态、分数、正确率和消息。
   *
   * @param job 任务
   * - `challengeId`: 挑战 ID
   * - `submissionId`: 提交记录 ID
   * @returns 一个对象，包含是否通过和提交类型
   * - `passed`: 是否通过
   * - `type`: 提交类型，如 `execute` 或 `preExecute`
   * @throws
   * - `Error`: 需要 `submissionId`
   * - `Error`: 提交记录不存在
   */
  @Process({
    name: 'preExecute',
    concurrency: Number(process.env.MAX_PRE_EXECUTE_CONCURRENCY ?? 2),
  })
  async handlePreExecute(job: TaskJob): Promise<ProcessResult> {
    const { submissionId, challengeId } = job.data;

    if (!submissionId) {
      throw new Error('需要 submissionId');
    }

    const submission = await this.submissionsService.findOne(submissionId);
    if (!submission) {
      throw new Error('提交记录不存在');
    }

    const result = await this.judgementsService.preExecute(challengeId);

    const resultMsg = JSON.stringify(result.result);
    await this.submissionsService.update(submissionId, {
      status: result.passed ? 'passed' : 'failed',
      score: result.score,
      correctRate: result.score / result.totalScore,
      message: resultMsg,
    });

    return { passed: result.passed, type: submission.type };
  }

  /**
   * 当任务执行完成时调用。
   *
   * 该方法会记录任务的完成状态，包括挑战 ID、提交记录 ID 和是否通过。例如：
   *
   * > [Execute] 挑战：1 | 提交：1 | 完成：passed
   *
   * @param job 完成的任务
   * - `challengeId`: 挑战 ID
   * - `submissionId`: 提交记录 ID
   * @param result 评测结果
   * - `passed`: 是否通过
   * - `type`: 提交类型，如 `execute` 或 `preExecute`
   */
  @OnQueueCompleted()
  async onExecuteCompleted(job: TaskJob, { passed, type }: ProcessResult) {
    const { challengeId, submissionId } = job.data;
    this.logger.log(
      `${badge(type)} 挑战：${challengeId} | 提交：${submissionId} | 完成：${
        passed ? 'passed' : 'failed'
      }`,
    );
  }

  /**
   * 当任务执行失败时调用。
   *
   * 该方法会记录任务的失败状态，包括挑战 ID、提交记录 ID 和错误消息。例如：
   *
   * > [Execute] 挑战：1 | 提交：1 | 失败：评测失败的原因
   *
   * @param job 失败的任务
   * - `challengeId`: 挑战 ID
   * - `submissionId`: 提交记录 ID
   * @param error 错误
   */
  @OnQueueFailed()
  async onExecuteFailed(job: TaskJob, error: Error) {
    const { submissionId, challengeId } = job.data;
    const { type } = await this.submissionsService.findOne(submissionId);
    this.logger.error(
      `${badge(type)} 挑战：${challengeId} | 提交：${submissionId} | 失败：${
        error.message
      }`,
    );
    await this.submissionsService.update(submissionId, {
      status: 'failed',
      score: 0,
      correctRate: 0,
      message: error.message,
    });
  }
}
