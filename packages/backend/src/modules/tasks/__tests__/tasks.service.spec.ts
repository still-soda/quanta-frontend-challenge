import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { AssetsService } from '../../assets/assets.service';
import { ChallengesService } from '../../challenges/challenges.service';
import { ChallengesModule } from '../../challenges/challenges.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { MoveMouseFlowData } from '../core/flow-data/index';

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

  it('应该正确获取 service', () => {
    expect(tasksService).toBeDefined();
    expect(assetsService).toBeDefined();
    expect(challengeService).toBeDefined();
  });

  describe('serializeFlowData', () => {
    it('应该正确序列化流程文件', async () => {
      const challenge = await challengeService.create({
        title: 'test',
        type: 'test',
        difficulty: 'test',
        authorId: 'test',
        score: 100,
      });
      const challengeId = challenge._id.toString();
      const flowDataDto: { data: MoveMouseFlowData[] } = {
        data: [
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
        ],
      };
      const flowDataName = `${challengeId}.json`;

      const serializeResult = await tasksService.serializeFlowData(
        challengeId,
        flowDataDto as any,
      );
      expect(serializeResult).toHaveProperty('ok', true);
      expect(serializeResult).toHaveProperty('fileName', flowDataName);
      const existResult = assetsService.isFileExists(flowDataName);
      expect(existResult).toHaveProperty('exists', true);
      expect(flowDataName).toBe(`${challengeId}.json`);
    });

    it('测试流程不合法时，应该抛出错误', async () => {
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
        data: [
          { detail: { name: '测试', score: 20 } },
          { detail: { name: '测试', score: 20 } },
          { detail: { name: '测试', score: 20 } },
        ],
      };

      await expect(
        tasksService.serializeFlowData(challengeId, flowDataDto as any),
      ).rejects.toThrow('Invalid flow data');
    });

    it('chellengeId 对应的挑战不存在时，应该抛出错误', async () => {
      const challengeId = 'test_challenge_id';
      const flowDataDto = {
        data: [
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
        ],
      };

      await expect(
        tasksService.serializeFlowData(challengeId, flowDataDto as any),
      ).rejects.toThrow('Challenge not found');
    });
  });

  describe('uploadStandardAnswer', () => {
    it('应该正确设置标准答案', async () => {
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
      const foundedChallenge = await challengeService.findOne(challengeId);
      const answerName = `${challengeId}.html`;
      expect(foundedChallenge).toHaveProperty('standardAnswer');
      expect(foundedChallenge.standardAnswer.includes(answerName)).toBe(true);
      // 检查文件是否存在
      const { exists } = assetsService.isFileExists(fileName);
      expect(exists).toBeTruthy();

      fileNames.push(fileName);
    });

    it('不存在 challengeId 对应的挑战时，应该抛出错误', async () => {
      const challengeId = 'test_challenge_id';
      const standardAnswer = new File(['test'], 'test.html');

      await expect(
        tasksService.uploadStandardAnswer(challengeId, standardAnswer),
      ).rejects.toThrow('Challenge not found');
    });

    it('文件为空时，应该抛出错误', async () => {
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

  describe('preExecute', () => {});

  describe('execute', () => {});
});
