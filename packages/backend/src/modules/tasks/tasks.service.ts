import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TaskJobData } from './tasks.processor';
import { SubmissionsService } from '../submissions/submissions.service';
import { ChallengesService } from '../challenges/challenges.service';
import { UsersService } from '../users/users.service';

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
  ) {}

  async pushExecuteJob(options: ExecuteTasksOptions) {
    const { challengeId, userId, submitFileId } = options;

    if (!this.challengesService.findOne(challengeId)) {
      throw new Error('找不到 Challenge');
    }

    if (!this.usersService.findOne(userId)) {
      throw new Error('找不到 User');
    }

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

    if (!this.challengesService.findOne(challengeId)) {
      throw new Error('找不到 Challenge');
    }

    if (!this.usersService.findOne(userId)) {
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
