import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { BullModule } from '@nestjs/bull';
import { SubmissionsModule } from '../../../modules/submissions/submissions.module';
import { JudgementsModule } from '../../../modules/judgements/judgements.module';
import { UsersModule } from '../../../modules/users/users.module';
import { ChallengesModule } from '../../../modules/challenges/challenges.module';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { createMockRedisModule } from '../../../utils/redis-mock.utils';
import { ChallengesService } from '../../../modules/challenges/challenges.service';
import { UsersService } from '../../../modules/users/users.service';
import { ActionsModule } from '../../../modules/actions/actions.module';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { CachesModule } from '../../../modules/caches/caches.module';
import { CounterModule } from '../../../modules/counter/counter.module';
import { Subject } from 'rxjs';
import { ResolvedChallengeModule } from '../../../modules/resolved-challenge/resolved-challenge.module';

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
        CachesModule,
        ResolvedChallengeModule,
        CounterModule,
        SubmissionsModule,
        JudgementsModule,
        ChallengesModule,
        UsersModule,
        ActionsModule,
        createEnvConfModule('.env.development'),
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

    const createActionSpy = jest
      .spyOn(tasksService['actionsService'], 'create')
      .mockImplementationOnce(() => ({}) as any);

    const increaseSpy = jest
      .spyOn(challengesService, 'increaseTotalSubmissions')
      .mockImplementationOnce(() => true as any);

    const addSpy = jest
      .spyOn(tasksService['tasksQueue'], 'add')
      .mockImplementationOnce(() => ({ id: 'jobId' }) as any);

    const { id: jobId } = await tasksService.pushExecuteJob({
      challengeId,
      userId,
      submitFileId,
    });

    expect(findOneChallengeSpy).toHaveBeenCalledWith(challengeId);
    expect(createActionSpy).toHaveBeenCalledTimes(1);
    expect(findOneUserSpy).toHaveBeenCalledWith(userId);
    expect(increaseSpy).toHaveBeenCalledWith(challengeId);
    expect(createSubmissionSpy).toHaveBeenCalledWith({
      challengeId,
      userId,
      type: 'execute',
    });
    expect(addSpy).toHaveBeenCalledWith('execute', {
      challengeId,
      submissionId,
      submitFileId,
      startAt: expect.any(Number),
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
      startAt: expect.any(Number),
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

  it('应该正确上传流程数据', async () => {
    const challengeId = 'challengeId';
    const userId = 'userId';
    const data = 'data';

    const uploadFlowDataSpy = jest
      .spyOn(tasksService, 'uploadFlowData')
      .mockImplementationOnce(() => true as any);

    const response = await tasksService.uploadFlowData(
      challengeId,
      userId,
      data,
    );

    expect(uploadFlowDataSpy).toHaveBeenCalledWith(challengeId, userId, data);
    expect(response).toBeTruthy();
  });

  it('应该正确获取前方排队中的任务数量的 Observable 对象', async () => {
    const submissionId = 'submissionId';
    const user = { id: 'userId', username: 'test', role: 0 };

    const findOneSubmissionSpy = jest
      .spyOn(tasksService['submissionsService'], 'findOne')
      .mockImplementationOnce(() => {
        return { userId: user.id, order: 1 } as any;
      });

    const subject = await tasksService.getPrevTaskCountSubject(
      submissionId,
      user,
    );

    expect(subject instanceof Subject).toBeTruthy();
    expect(findOneSubmissionSpy).toHaveBeenCalledWith(submissionId);
  });

  it('应该正确增加前方排队中的任务序列', async () => {
    const submissionId = 'submissionId';
    const user = { id: 'userId', username: 'test', role: 0 };

    const findOneSubmissionSpy = jest
      .spyOn(tasksService['submissionsService'], 'findOne')
      .mockImplementationOnce(() => {
        return { userId: user.id, order: 2 } as any;
      });
    const increaseSpy = jest
      .spyOn(tasksService['cachesService'], 'incr')
      .mockImplementationOnce(async () => 1);
    const setSpy = jest
      .spyOn(tasksService['cachesService'], 'set')
      .mockImplementationOnce(async () => 'OK');

    const subject = await tasksService.getPrevTaskCountSubject(
      submissionId,
      user,
    );

    let count = 0;
    subject.subscribe({
      next: (value) => {
        count = value;
      },
    });

    await tasksService.increasePrevTaskCount();

    expect(count).toBe(1);
    expect(findOneSubmissionSpy).toHaveBeenCalledWith(submissionId);
    expect(increaseSpy).toHaveReturnedTimes(1);
    expect(setSpy).toHaveBeenCalledTimes(1);
  });
});
