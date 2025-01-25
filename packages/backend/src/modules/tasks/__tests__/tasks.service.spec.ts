import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { AssetsService } from '../../assets/assets.service';
import { ChallengesService } from '../../challenges/challenges.service';
import { ChallengesModule } from '../../challenges/challenges.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import {
  ClickMouseFlowData,
  ExpectTestpointFlowData,
  MoveMouseFlowData,
  ScreenShotTestpointFlowData,
} from '../core/flow-data/index';
import { uuidFileNameRegEndWith } from '../../../utils/testing.utils';
import { AssetsModule } from '../../../modules/assets/assets.module';

describe('TasksService', () => {
  let tasksService: TasksService;
  let assetsService: AssetsService;
  let challengeService: ChallengesService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mockDb.module,
        createEnvConfModule(),
        ChallengesModule,
        AssetsModule,
      ],
      providers: [TasksService, AssetsService, ChallengesService],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    assetsService = module.get<AssetsService>(AssetsService);
    challengeService = module.get<ChallengesService>(ChallengesService);
  });

  afterAll(async () => {
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
      expect(challenge.flowdataId).toBeUndefined();

      const challengeId = challenge.id;
      const flowDataDto: { data: MoveMouseFlowData[] } = {
        data: [
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
        ],
      };

      const { id, ok, fileName } = await tasksService.serializeFlowData(
        challengeId,
        flowDataDto as any,
      );
      expect(ok).toBe(true);
      expect(fileName).toMatch(uuidFileNameRegEndWith('.json'));

      const { exists } = await assetsService.isFileExists({ fileName });
      expect(exists).toBe(true);

      const { flowdataId } = await challengeService.findOne(challengeId);
      expect(flowdataId).toBe(id);
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
      ).rejects.toThrow('非法的流程数据');
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
      ).rejects.toThrow('找不到 Challenge');
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

      const { fileName, ok, id } = await tasksService.uploadStandardAnswer(
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
      expect(foundedChallenge).toHaveProperty('standardAnswer');
      expect(foundedChallenge.standardAnswer.includes(id)).toBe(true);
      // 检查文件是否存在
      const { exists } = await assetsService.isFileExists({ fileName });
      expect(exists).toBeTruthy();
    });

    it('不存在 challengeId 对应的挑战时，应该抛出错误', async () => {
      const challengeId = 'test_challenge_id';
      const standardAnswer = new File(['test'], 'test.html');

      await expect(
        tasksService.uploadStandardAnswer(challengeId, standardAnswer),
      ).rejects.toThrow('找不到 Challenge');
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
      ).rejects.toThrow('文件不存在');
    });
  });

  describe('preExecute', () => {
    it('应该正确预执行正确的流程文件，返回通过和正确信息', async () => {
      const chllenge = await challengeService.create({
        title: 'test',
        type: 'test',
        difficulty: 'test',
        authorId: 'test',
        score: 100,
      });

      const page = `
        <html>
          <head>
            <title>test</title>
          </head>
          <body>
            <button id="btn">click me</button>
            <script>
              document.getElementById('btn').addEventListener('click', function() {
                alert('clicked');
              });
            </script>
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = chllenge.id;
      const uploadResult = await tasksService.uploadStandardAnswer(
        challengeId,
        standardAnswer,
      );
      expect(uploadResult.ok).toBe(true);

      const data = [
        {
          type: 'mouse',
          detail: {
            type: 'move',
            selector: 'button',
          },
        } as MoveMouseFlowData,
        {
          type: 'mouse',
          detail: {
            type: 'click',
            selector: 'button',
          },
        } as ClickMouseFlowData,
        {
          type: 'testpoint',
          detail: {
            type: 'screenshot',
            name: 'test',
            score: 20,
            threshold: 0.9,
            selector: 'body',
            root: 'button',
          },
        } as ScreenShotTestpointFlowData,
        {
          type: 'testpoint',
          detail: {
            type: 'expect',
            name: 'test',
            score: 20,
            selector: 'button',
            text: 'clicked',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await tasksService.serializeFlowData(
        chllenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const preExcuteResult = await tasksService.preExecute(chllenge.id);
    });

    it.todo('正确预执行正确的流程文件后，应该将结果关联到对应的挑战');

    it.todo('预执行不合法的流程文件时，应该中断并返回不通过和错误信息');

    it.todo('预执行不合法的流程文件后，不应该将结果关联到对应的挑战');
  });

  describe('execute', () => {});
});
