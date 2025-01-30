import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TaskJobData } from './tasks.processor';
import { SubmissionsService } from '../submissions/submissions.service';

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
  ) {}

  async pushExecuteJob(options: ExecuteTasksOptions) {
    const { challengeId, userId, submitFileId } = options;
    const { id: submissionId } = await this.submissionsService.create({
      challengeId,
      userId,
      type: 'execute',
    });

    return await this.tasksQueue.add('execute', {
      challengeId,
      submissionId,
      submitFileId,
    });
  }

  async pushPreExecuteJob(options: PreExecuteTasksOptions) {
    const { challengeId, userId } = options;
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
