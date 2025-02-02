import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { BullModule } from '@nestjs/bull';
import { SubmissionsModule } from '../../../modules/submissions/submissions.module';
import { JudgementsModule } from '../../../modules/judgements/judgements.module';
import { UsersModule } from '../../../modules/users/users.module';
import { ChallengesModule } from '../../../modules/challenges/challenges.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { createMockRedisModule } from '../../../utils/create-redis.mock.utils';
import { ChallengesService } from '../../../modules/challenges/challenges.service';
import { UsersService } from '../../../modules/users/users.service';
import Redis from 'ioredis';
import mongoose from 'mongoose';

describe('TasksService', () => {
  let module: TestingModule;
  let mongodb: MongoMemoryServer;
  let redis: Redis;
  let tasksService: TasksService;
  let challengesService: ChallengesService;
  let usersService: UsersService;

  beforeAll(async () => {
    const mockDB = await createMockDBModule();
    mongodb = mockDB.mongodb;
    const mockRedis = await createMockRedisModule();
    redis = mockRedis.redis;

    module = await Test.createTestingModule({
      imports: [
        mockDB.module,
        mockRedis.module,
        BullModule.registerQueue({
          name: 'tasks',
          defaultJobOptions: { timeout: 30000 },
        }),
        SubmissionsModule,
        JudgementsModule,
        ChallengesModule,
        UsersModule,
        createEnvConfModule(),
      ],
      providers: [TasksService],
    }).compile();

    await module.init();

    tasksService = module.get<TasksService>(TasksService);
    challengesService = module.get<ChallengesService>(ChallengesService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await module.close();
    await mongoose.disconnect();
    await mongodb.stop();
    await redis.quit();
  });

  it('应该正确获取服务', () => {
    expect(tasksService).toBeDefined();
    expect(challengesService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('应该正确推送执行任务到队列', async () => {
    const challengeId = 'challengeId';
    const userId = 'userId';
    const submitFileId = 'submitFileId';

    const findOneChallengeSpy = jest
      .spyOn(challengesService, 'findOne')
      .mockImplementationOnce(() => true as any);
    const findOneUserSpy = jest
      .spyOn(usersService, 'findOne')
      .mockImplementationOnce(() => true as any);

    const submissionId = 'submissionId';
    const createSubmissionSpy = jest
      .spyOn(tasksService['submissionsService'], 'create')
      .mockImplementationOnce(() => ({ id: submissionId }) as any);

    const addSpy = jest
      .spyOn(tasksService['tasksQueue'], 'add')
      .mockImplementationOnce(() => ({ id: 'jobId' }) as any);

    const { id: jobId } = await tasksService.pushExecuteJob({
      challengeId,
      userId,
      submitFileId,
    });

    expect(findOneChallengeSpy).toHaveBeenCalledWith(challengeId);
    expect(findOneUserSpy).toHaveBeenCalledWith(userId);
    expect(createSubmissionSpy).toHaveBeenCalledWith({
      challengeId,
      userId,
      type: 'execute',
    });
    expect(addSpy).toHaveBeenCalledWith('execute', {
      challengeId,
      submissionId,
      submitFileId,
    });

    expect(jobId).toBe('jobId');
  });

  it.each([
    ['找不到 Challenge', { userId: 'userId' }],
    ['找不到 User', { challengeId: 'challengeId' }],
  ])(`执行推送应该正确抛出异常：%s`, async (msg, options: any) => {
    jest
      .spyOn(challengesService, 'findOne')
      .mockImplementationOnce((id) => id as any);
    options?.challengeId &&
      jest
        .spyOn(usersService, 'findOne')
        .mockImplementationOnce((id) => id as any);

    options['submitFileId'] = 'submitFileId';
    await expect(tasksService.pushExecuteJob(options as any)).rejects.toThrow(
      msg,
    );
  });

  it('应该正确推送预执行任务到队列', async () => {
    const challengeId = 'challengeId';
    const userId = 'userId';

    const findOneChallengeSpy = jest
      .spyOn(challengesService, 'findOne')
      .mockImplementationOnce(() => true as any);
    const findOneUserSpy = jest
      .spyOn(usersService, 'findOne')
      .mockImplementationOnce(() => true as any);

    const submissionId = 'submissionId';
    const createSubmissionSpy = jest
      .spyOn(tasksService['submissionsService'], 'create')
      .mockImplementationOnce(() => ({ id: submissionId }) as any);

    const addSpy = jest
      .spyOn(tasksService['tasksQueue'], 'add')
      .mockImplementationOnce(() => ({ id: 'jobId' }) as any);

    const { id: jobId } = await tasksService.pushPreExecuteJob({
      challengeId,
      userId,
    });

    expect(findOneChallengeSpy).toHaveBeenCalledWith(challengeId);
    expect(findOneUserSpy).toHaveBeenCalledWith(userId);
    expect(createSubmissionSpy).toHaveBeenCalledWith({
      challengeId,
      userId,
      type: 'preExecute',
    });
    expect(addSpy).toHaveBeenCalledWith('preExecute', {
      challengeId,
      submissionId,
    });

    expect(jobId).toBe('jobId');
  });

  it.each([
    ['找不到 Challenge', { userId: 'userId' }],
    ['找不到 User', { challengeId: 'challengeId' }],
  ])(`预执行推送应该正确抛出异常：%s`, async (msg, options: any) => {
    jest
      .spyOn(challengesService, 'findOne')
      .mockImplementationOnce((id) => id as any);
    options?.challengeId &&
      jest
        .spyOn(usersService, 'findOne')
        .mockImplementationOnce((id) => id as any);

    await expect(
      tasksService.pushPreExecuteJob(options as any),
    ).rejects.toThrow(msg);
  });
});
