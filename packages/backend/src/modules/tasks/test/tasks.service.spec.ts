import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { AssetsService } from '../../assets/assets.service';
import { ChallengesService } from '../../challenges/challenges.service';
import { ChallengesModule } from '../../challenges/challenges.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';

describe('TasksService', () => {
  let tasksService: TasksService;
  let assetsService: AssetsService;
  let challengeService: ChallengesService;
  let mongodb: MongoMemoryServer;
  let fileNames: string[] = [];

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [mockDb.module, createEnvConfModule(), ChallengesModule],
      providers: [TasksService, AssetsService, ChallengesService],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    assetsService = module.get<AssetsService>(AssetsService);
    challengeService = module.get<ChallengesService>(ChallengesService);
  });

  afterAll(async () => {
    await Promise.all(
      fileNames.map(async (fileName) => {
        assetsService.deleteFile(fileName);
      }),
    );
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  /////////////// serializeFlowData ///////////////

  // 应该正确序列化流程文件
  it('should serialize flow data and save correctly', async () => {
    const challenge = await challengeService.create({
      title: 'test',
      type: 'test',
      difficulty: 'test',
      authorId: 'test',
      score: 100,
    });
    const challengeId = challenge._id.toString();
    const flowDataDto = {
      flowData: [
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
      ],
    };
    const flowDataName = `${challengeId}.json`;

    await tasksService.serializeFlowData(challengeId, flowDataDto as any);
    const result = assetsService.isFileExists(flowDataName);
    expect(result).toHaveProperty('exists', true);
    expect(flowDataName).toBe(`${challengeId}.json`);
  });

  // 测试流程不合法时，应该抛出错误
  it('should throw error when flow data is invalid', async () => {
    const challenge = await challengeService.create({
      title: 'test',
      type: 'test',
      difficulty: 'test',
      authorId: 'test',
      score: 100,
    });
    const challengeId = challenge._id.toString();
    // 没有type字段
    const flowDataDto = {
      flowData: [
        { detail: { name: '测试', score: 20 } },
        { detail: { name: '测试', score: 20 } },
        { detail: { name: '测试', score: 20 } },
      ],
    };

    await expect(
      tasksService.serializeFlowData(challengeId, flowDataDto as any),
    ).rejects.toThrow('Invalid flow data');
  });

  // chellengeId对应的挑战不存在时，应该抛出错误
  it('should throw error when challenge not found', async () => {
    const challengeId = 'test_challenge_id';
    const flowDataDto = {
      flowData: [
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
      ],
    };

    await expect(
      tasksService.serializeFlowData(challengeId, flowDataDto as any),
    ).rejects.toThrow('Challenge not found');
  });

  ///////////// uploadStandardAnswer /////////////

  // 应该正确设置标准答案
  it('should set standard answer correctly', async () => {
    const challenge = await challengeService.create({
      title: 'test',
      type: 'test',
      difficulty: 'test',
      authorId: 'test',
      score: 100,
    });

    const standardAnswer = new File(['test'], 'test.html');
    const challengeId = challenge._id.toString();

    const { fileName, ok } = await tasksService.uploadStandardAnswer(
      challengeId,
      standardAnswer,
      '.html',
    );
    expect(ok).toBeTruthy();
    expect(fileName).toMatch(
      /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}\.html/,
    );
    // 检查数据库中是否正确设置了标准答案
    expect(challengeService.findOne(challengeId)).toHaveProperty(
      'standardAnswer',
      fileName,
    );
    // 检查文件是否存在
    const { exists } = assetsService.isFileExists(fileName);
    expect(exists).toBeTruthy();

    fileNames.push(fileName);
  });

  // 不存在challengeId对应的挑战时，应该抛出错误
  it('should throw error when challenge not found', async () => {
    const challengeId = 'test_challenge_id';
    const flowDataDto = {
      flowData: [
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
      ],
    };

    await expect(
      tasksService.serializeFlowData(challengeId, flowDataDto as any),
    ).rejects.toThrow('Challenge not found');
  });

  // 文件为空时，应该抛出错误
  it('should throw error when file is empty', async () => {
    const challenge = await challengeService.create({
      title: 'test',
      type: 'test',
      difficulty: 'test',
      authorId: 'test',
      score: 100,
    });

    const standardAnswer = null as File;
    const challengeId = challenge._id.toString();

    await expect(
      tasksService.uploadStandardAnswer(challengeId, standardAnswer, '.html'),
    ).rejects.toThrow('File is empty');
  });
});
