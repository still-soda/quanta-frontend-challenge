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
  PreExecuteResult,
} from '../judgements/judgements.service';
import { Logger } from '@nestjs/common';
import { SubmissionsService } from '../submissions/submissions.service';
import { SubmissionType } from 'src/schemas/submissions.schema';

type TaskJob = Job<{
  challengeId: string;
  submissionId: string;
  submitFileId?: string;
}>;

type ProcessResult = {
  passed: boolean;
  type: SubmissionType;
};

// badge('execute') => '[Execute]'
const badge = (str: string) =>
  `[${str.toUpperCase().slice(0, 1)}${str.toLowerCase().slice(1)}]`;

@Processor('tasks')
export class TasksProcessor {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(
    private readonly judgementsService: JudgementsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  @Process('execute')
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

  @Process('preExecute')
  async handlePreExecute(job: TaskJob): Promise<ProcessResult> {
    if (!job.data.submissionId) {
      throw new Error('需要 submissionId');
    }

    const submission = await this.submissionsService.findOne(
      job.data.submissionId,
    );
    if (!submission) {
      throw new Error('提交记录不存在');
    }

    const result = await this.judgementsService.preExecute(
      job.data.challengeId,
    );

    const resultMsg = JSON.stringify(result.result);
    await this.submissionsService.update(job.data.submissionId, {
      status: result.passed ? 'passed' : 'failed',
      score: result.score,
      correctRate: result.score / result.totalScore,
      message: resultMsg,
    });

    return { passed: result.passed, type: submission.type };
  }

  @OnQueueCompleted()
  async onExecuteCompleted(job: TaskJob, { passed, type }: ProcessResult) {
    const { challengeId, submissionId } = job.data;
    this.logger.log(
      `${badge(type)} 挑战：${challengeId} | 提交：${submissionId} | 完成：${
        passed ? 'passed' : 'failed'
      }`,
    );
  }

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
