import { Test, TestingModule } from '@nestjs/testing';
import { TaskJob, TasksProcessor } from '../tasks.processor';
import { JudgementsModule } from '../../../modules/judgements/judgements.module';
import { SubmissionsModule } from '../../../modules/submissions/submissions.module';
import { JudgementsService } from '../../judgements/judgements.service';
import { SubmissionsService } from '../../submissions/submissions.service';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ChallengesModule } from '../../../modules/challenges/challenges.module';
import { ChallengesService } from '../../../modules/challenges/challenges.service';
import { CachesModule } from '../../../modules/caches/caches.module';
import { TasksModule } from '../tasks.module';
import { TasksService } from '../tasks.service';
import { CHALLENGE_STATUS } from '../../../schemas/challenges.schema';
import { UsersService } from '../../../modules/users/users.service';

describe('TasksProcessor', () => {
  let processor: TasksProcessor;
  let mongodb: MongoMemoryServer;
  let module: TestingModule;
  let judgementsService: JudgementsService;
  let submissionService: SubmissionsService;
  let challengeService: ChallengesService;
  let tasksService: TasksService;
  let usersService: UsersService;

  const id = '6756f5605fe86d4166703162';

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    module = await Test.createTestingModule({
      imports: [
        JudgementsModule,
        SubmissionsModule,
        ChallengesModule,
        CachesModule,
        TasksModule,
        createEnvConfModule('.env.development'),
        mockDb.module,
      ],
    }).compile();
    module.useLogger(console);
    await module.init();

    judgementsService = module.get<JudgementsService>(JudgementsService);
    submissionService = module.get<SubmissionsService>(SubmissionsService);
    challengeService = module.get<ChallengesService>(ChallengesService);
    tasksService = module.get<TasksService>(TasksService);
    usersService = module.get<UsersService>(UsersService);
    processor = new TasksProcessor(
      judgementsService,
      submissionService,
      challengeService,
      tasksService,
      usersService,
    );
  });

  afterAll(async () => {
    await module.close();
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it.each([
    ['缺少submissionId', undefined, id, '需要 submissionId'],
    ['缺少submitFileId', id, undefined, '需要 submitFileId'],
    ['提交记录不存在', id, id, '提交记录不存在'],
  ])(
    '应该正确验证执行的任务（%s）',
    async (_, submissionId, submitFileId, error) => {
      const job: TaskJob = {
        id: '1',
        name: 'execute',
        data: { submissionId, submitFileId },
      } as any;

      await expect(processor.handleExecute(job)).rejects.toThrow(error);
    },
  );

  it('应该正确执行任务（Execute）', async () => {
    const mockResult = [['ok1'], ['ok2']];

    const mockExecute = jest
      .spyOn(judgementsService, 'execute')
      .mockImplementation(async () => {
        return {
          passed: true,
          result: mockResult as any,
          score: 100,
          totalScore: 100,
          screenshotIdList: [],
        };
      });

    const mockFindOne = jest
      .spyOn(submissionService, 'findOne')
      .mockImplementation(async () => ({ type: 'execute_test' }) as any);

    const mockUpdate = jest
      .spyOn(submissionService, 'update')
      .mockImplementation(async () => ({}) as any);

    const mockSolveChallenge = jest
      .spyOn(challengeService, 'solveChallenge')
      .mockImplementation(async () => ({}) as any);

    const mockSubmitChallenge = jest
      .spyOn(usersService, 'submitChallenge')
      .mockImplementation(async () => ({}) as any);

    const mockGetMaxSubmissionScore = jest
      .spyOn(submissionService, 'getMaxSubmissionScore')
      .mockImplementation(async () => 50);

    const mockModifyUserScore = jest
      .spyOn(usersService, 'modifyUserScore')
      .mockImplementation(async () => ({}) as any);

    const job: TaskJob = {
      id: '1',
      name: 'execute',
      data: { submissionId: id, submitFileId: id, challengeId: id },
    } as any;

    const result = await processor.handleExecute(job);

    expect(mockExecute).toHaveBeenCalledWith(id, id);
    expect(mockFindOne).toHaveBeenCalledWith(id);
    expect(mockSolveChallenge.mock.calls[0][0]).toEqual(id);
    expect(mockSubmitChallenge).toHaveBeenCalledTimes(1);
    expect(mockGetMaxSubmissionScore).toHaveBeenCalledTimes(1);
    expect(mockModifyUserScore).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(id, {
      status: 'passed',
      score: 100,
      correctRate: 1,
      message: JSON.stringify(mockResult),
    });
    expect(result).toEqual({ passed: true, type: 'execute_test' });
  });

  it('应该正确执行任务（PreExecute）', async () => {
    const mockResult = [['ok1'], ['ok2']];

    const mockPreExecute = jest
      .spyOn(judgementsService, 'preExecute')
      .mockImplementation(async () => {
        return {
          passed: true,
          result: mockResult as any,
          score: 100,
          totalScore: 100,
          screenshotIdList: [],
        };
      });

    const findMock = jest
      .spyOn(submissionService, 'findOne')
      .mockImplementation(
        async () => ({ type: 'preExecute', challengeId: '123' }) as any,
      );

    const updateMock = jest
      .spyOn(submissionService, 'update')
      .mockImplementation(async () => ({}) as any);

    const setStatusToMock = jest
      .spyOn(challengeService, 'setStatusTo')
      .mockImplementation(async () => ({}) as any);

    const job: TaskJob = {
      id: '1',
      name: 'preExecute',
      data: { challengeId: id, submissionId: id },
    } as any;

    const result = await processor.handlePreExecute(job);

    expect(mockPreExecute).toHaveBeenCalledWith(id);
    expect(findMock).toHaveBeenCalledWith(id);
    expect(updateMock).toHaveBeenCalledWith(id, {
      status: 'passed',
      score: 100,
      correctRate: 1,
      message: JSON.stringify(mockResult),
    });
    expect(setStatusToMock).toHaveBeenCalledWith('123', CHALLENGE_STATUS.READY);
    expect(result).toEqual({ passed: true, type: 'preExecute' });
  });

  it('应该正确记录日志（onCompleted）', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    const job: TaskJob = {
      id: '1',
      name: 'execute',
      data: { challengeId: id, submissionId: id },
    } as any;

    await processor.onExecuteCompleted(job, {
      passed: true,
      type: 'execute',
    });

    expect(logSpy).toHaveBeenCalledWith(
      '[Execute] 挑战：6756f5605fe86d4166703162 | 提交：6756f5605fe86d4166703162 | 完成：passed',
      'TasksProcessor',
    );

    logSpy.mockRestore();
  });

  it('应该正确记录日志（onFailed）', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    jest.spyOn(submissionService, 'findOne').mockImplementation(async () => {
      return { type: 'execute' } as any;
    });

    const job: TaskJob = {
      id: '1',
      name: 'execute',
      data: { challengeId: id, submissionId: id },
    } as any;

    await processor.onExecuteFailed(job, new Error('error message'));

    expect(errorSpy).toHaveBeenCalledWith(
      '[Execute] 挑战：6756f5605fe86d4166703162 | 提交：6756f5605fe86d4166703162 | 失败：error message',
      undefined,
      'TasksProcessor',
    );

    errorSpy.mockRestore();
  });

  it('无论执行成功还是失败都应该调用 onExecuteFinished', async () => {
    const spyOnExecuteFinished = jest.fn();
    processor['onExecuteFinished'] = spyOnExecuteFinished;

    const job: TaskJob = {
      id: '1',
      name: 'execute',
      data: { challengeId: id, submissionId: id },
    } as any;

    await processor.onExecuteCompleted(job, {
      passed: true,
      type: 'execute',
    });

    expect(spyOnExecuteFinished).toHaveBeenCalled();
    spyOnExecuteFinished.mockClear();

    await processor.onExecuteFailed(job, new Error('error message'));

    expect(spyOnExecuteFinished).toHaveBeenCalled();
  });
});
