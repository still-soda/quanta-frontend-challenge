import { Test, TestingModule } from '@nestjs/testing';
import { JudgementsService } from '../judgements.service';
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
import { AssetsModule } from '../../assets/assets.module';
import { CHALLENGE_STATUS } from '../../../schemas/challenges.schema';
import { CreateChallengeDto } from '../../../modules/challenges/dto/create-challenge.dto';
import validateData from '../../../utils/validate-data.utils';
import { ROLE } from '../../../common/decorators/auth.decorator';

jest.mock('../../../utils/validate-data.utils');

const mockValidateData = validateData as jest.Mock;
mockValidateData.mockImplementation((_, data) => data);

describe('JudgementsService', () => {
  let judgementsService: JudgementsService;
  let assetsService: AssetsService;
  let challengeService: ChallengesService;
  let mongodb: MongoMemoryServer;
  let module: TestingModule;

  async function createChallenge(
    options: Omit<CreateChallengeDto, 'content'> & { authorId: string },
  ) {
    return await challengeService.create(
      { id: options.authorId, username: 'test', role: ROLE.ADMIN },
      { ...options, content: 'test' },
    );
  }

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    module = await Test.createTestingModule({
      imports: [
        mockDb.module,
        createEnvConfModule(),
        ChallengesModule,
        AssetsModule,
      ],
      providers: [JudgementsService, AssetsService, ChallengesService],
    }).compile();

    await module.init();

    judgementsService = module.get<JudgementsService>(JudgementsService);
    assetsService = module.get<AssetsService>(AssetsService);
    challengeService = module.get<ChallengesService>(ChallengesService);
  });

  afterAll(async () => {
    await module.close();
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取 service', () => {
    expect(judgementsService).toBeDefined();
    expect(assetsService).toBeDefined();
    expect(challengeService).toBeDefined();
  });

  describe('serializeFlowData', () => {
    it('应该正确序列化流程文件', async () => {
      const challenge = await createChallenge({
        title: 'test',
        type: 'test',
        difficulty: 'test',
        authorId: 'test',
        score: 100,
      });
      expect(challenge.flowdataId).toBeUndefined();

      const challengeId = challenge.id;
      const flowDataDto: {
        data: (MoveMouseFlowData | ExpectTestpointFlowData)[];
      } = {
        data: [
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          {
            type: 'testpoint',
            detail: { type: 'expect', name: 'test', score: 20 },
          },
        ],
      };

      const { id, ok, fileName } = await judgementsService.serializeFlowData(
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

    describe('测试流程不合法时，应该抛出错误', () => {
      test('流程验证不通过', async () => {
        const challenge = await createChallenge({
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
            { type: 'testpoint', detail: { name: '测试', score: 20 } },
            { detail: { name: '测试', score: 20 } },
            { detail: { name: '测试', score: 20 } },
          ],
        };

        await expect(
          judgementsService.serializeFlowData(challengeId, flowDataDto as any),
        ).rejects.toThrow('非法的流程数据');
      });

      test('总分小于等于0', async () => {
        const challenge = await createChallenge({
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
            { type: 'testpoint', detail: { name: '测试', score: 0 } },
            { detail: { name: '测试', score: 0 } },
            { detail: { name: '测试', score: 0 } },
          ],
        };

        await expect(
          judgementsService.serializeFlowData(challengeId, flowDataDto as any),
        ).rejects.toThrow('流程总分必须大于 0');
      });

      test('没有测试点', async () => {
        const challenge = await createChallenge({
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
          judgementsService.serializeFlowData(challengeId, flowDataDto as any),
        ).rejects.toThrow('至少要有一个测试点');
      });
    });

    it('chellengeId 对应的挑战不存在时，应该抛出错误', async () => {
      const challengeId = 'test_challenge_id';
      const flowDataDto = {
        data: [
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'mouse', detail: { type: 'move' } },
          { type: 'testpoint', detail: { type: 'move' } },
        ],
      };

      await expect(
        judgementsService.serializeFlowData(challengeId, flowDataDto as any),
      ).rejects.toThrow('找不到 Challenge');
    });
  });

  describe('uploadStandardAnswer', () => {
    it('应该正确设置标准答案', async () => {
      const challenge = await createChallenge({
        title: 'test',
        type: 'test',
        difficulty: 'test',
        authorId: 'test',
        score: 100,
      });

      const standardAnswer = new File(['test'], 'test.html');
      const challengeId = challenge._id.toString();

      const { fileName, ok, id } = await judgementsService.uploadStandardAnswer(
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
        judgementsService.uploadStandardAnswer(challengeId, standardAnswer),
      ).rejects.toThrow('找不到 Challenge');
    });

    it('文件为空时，应该抛出错误', async () => {
      const challenge = await createChallenge({
        title: 'test',
        type: 'test',
        difficulty: 'test',
        authorId: 'test',
        score: 100,
      });

      const standardAnswer = null as File;
      const challengeId = challenge._id.toString();

      await expect(
        judgementsService.uploadStandardAnswer(
          challengeId,
          standardAnswer,
          '.html',
        ),
      ).rejects.toThrow('文件不存在');
    });
  });

  describe('preExecute', () => {
    it('应该正确预执行正确的流程文件，返回通过和正确信息', async () => {
      const challenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = challenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
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
            text: 'click me',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        challenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const preExcuteResult = await judgementsService.preExecute(challenge.id);
      expect(preExcuteResult.totalScore).toBe(40);
      expect(preExcuteResult.score).toBe(40);
      expect(preExcuteResult.result.every((r) => r.success)).toBe(true);
      expect(preExcuteResult).toHaveProperty('passed', true);

      const updatedChallenge = await challengeService.findOne(challenge.id);
      expect(updatedChallenge.screenshots).toHaveProperty('length', 1);
      expect(updatedChallenge).toHaveProperty('status', CHALLENGE_STATUS.READY);
      expect(updatedChallenge.flowdataId).toBe(serializeResult.id);
    });

    it('预执行不合法的流程文件时，应该中断并返回不通过和错误信息', async () => {
      const chllenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = chllenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
        challengeId,
        standardAnswer,
      );
      expect(uploadResult.ok).toBe(true);

      const data = [
        {
          type: 'mouse',
          detail: {
            type: 'move',
            selector: '#btn',
          },
        } as MoveMouseFlowData,
        {
          type: 'mouse',
          detail: {
            type: 'click',
            selector: '#btn',
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
            root: '#btn',
          },
        } as ScreenShotTestpointFlowData,
        {
          type: 'testpoint',
          detail: {
            type: 'expect',
            name: 'test',
            score: 20,
            selector: '#btn',
            text: '---------- not click me ----------',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        chllenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const preExcuteResult = await judgementsService.preExecute(chllenge.id);
      expect(preExcuteResult.totalScore).toBe(40);
      expect(preExcuteResult.score).toBe(20);
      expect(preExcuteResult.result.every((r) => r.success)).toBe(true);
      expect(preExcuteResult).toHaveProperty('passed', false);

      const updatedChallenge = await challengeService.findOne(chllenge.id);
      expect(updatedChallenge.screenshots).toHaveProperty('length', 1);
      expect(updatedChallenge).toHaveProperty('status', CHALLENGE_STATUS.DRAFT);
      expect(updatedChallenge.flowdataId).toBe(serializeResult.id);
    });

    it('流程发生错误时，应该中断并返回不通过和错误信息', async () => {
      const chllenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = chllenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
        challengeId,
        standardAnswer,
      );
      expect(uploadResult.ok).toBe(true);

      const data = [
        {
          type: 'mouse',
          detail: {
            type: 'move',
            selector: '#btn',
          },
        } as MoveMouseFlowData,
        {
          type: 'mouse',
          detail: {
            type: 'click',
            // 注意这里的 selector 是错误的
            selector: '#btn--',
          },
        } as ClickMouseFlowData,
        {
          type: 'mouse',
          detail: {
            type: 'click',
            selector: '#btn',
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
            root: '#btn',
          },
        } as ScreenShotTestpointFlowData,
        {
          type: 'testpoint',
          detail: {
            type: 'expect',
            name: 'test',
            score: 20,
            selector: '#btn',
            text: 'click me',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        chllenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const preExcuteResult = await judgementsService.preExecute(chllenge.id);
      expect(preExcuteResult.totalScore).toBe(40);
      expect(preExcuteResult.score).toBe(0);
      expect(preExcuteResult.result.length).toBe(2);
      expect(preExcuteResult.result[1].success).toBe(false);
      expect(preExcuteResult).toHaveProperty('passed', false);

      const updatedChallenge = await challengeService.findOne(chllenge.id);
      expect(updatedChallenge.screenshots).toHaveProperty('length', 0);
      expect(updatedChallenge).toHaveProperty('status', CHALLENGE_STATUS.DRAFT);
      expect(updatedChallenge.flowdataId).toBe(serializeResult.id);
    });
  });

  describe('execute', () => {
    it('如果挑战不在发布状态，应该抛出错误', async () => {
      const challenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = challenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
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
            text: 'click me',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        challenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const { passed } = await judgementsService.preExecute(challenge.id);
      expect(passed).toBe(true);

      await expect(
        judgementsService.execute(challengeId, 'test_file_id'),
      ).rejects.toThrow('挑战未发布');
    });

    it('应该正确执行挑战，返回执行结果（部分错误，不通过）', async () => {
      const challenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = challenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
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
            text: 'click me',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        challenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const { passed } = await judgementsService.preExecute(challenge.id);
      expect(passed).toBe(true);

      const result = await challengeService.setStatusTo(
        challengeId,
        CHALLENGE_STATUS.PUBLISHED,
      );
      expect(result.status).toBe(CHALLENGE_STATUS.PUBLISHED);

      const testPage = `
        <html>
          <head>
            <title>test</title>
          </head>
          <body>
            <button id="btn">not click me</button>
          </body>
        </html>
      `;
      const { id } = await assetsService.saveTextFile({
        content: testPage,
        name: 'test.html',
        mimeType: 'text/html',
      });

      const executeResult = await judgementsService.execute(challengeId, id);
      expect(executeResult.totalScore).toBe(40);
      expect(executeResult.score).toBe(0);
      expect(executeResult.passed).toBe(false);
      expect(executeResult.screenshotIdList.length).toBe(1);
      expect(executeResult.result.length).toBe(4);
    });

    it('应该正确执行挑战，返回执行结果（完全正确，通过）', async () => {
      const challenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = challenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
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
            text: 'click me',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        challenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const { passed } = await judgementsService.preExecute(challenge.id);
      expect(passed).toBe(true);

      const result = await challengeService.setStatusTo(
        challengeId,
        CHALLENGE_STATUS.PUBLISHED,
      );
      expect(result.status).toBe(CHALLENGE_STATUS.PUBLISHED);

      const testPage = page;
      const { id } = await assetsService.saveTextFile({
        content: testPage,
        name: 'test.html',
        mimeType: 'text/html',
      });

      const executeResult = await judgementsService.execute(challengeId, id);
      expect(executeResult.totalScore).toBe(40);
      expect(executeResult.score).toBe(40);
      expect(executeResult.passed).toBe(true);
      expect(executeResult.screenshotIdList.length).toBe(1);
      expect(executeResult.result.length).toBe(4);
    });

    it('如果执行过程中发生错误，应该中断并返回错误信息', async () => {
      const challenge = await createChallenge({
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
          </body>
        </html>
      `;
      const standardAnswer = new File([page], 'test.html');
      const challengeId = challenge.id;
      const uploadResult = await judgementsService.uploadStandardAnswer(
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
            selector: '#btn',
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
            text: 'click me',
          },
        } as ExpectTestpointFlowData,
      ];

      const serializeResult = await judgementsService.serializeFlowData(
        challenge.id,
        { data },
      );
      expect(serializeResult.ok).toBe(true);

      const { passed } = await judgementsService.preExecute(challenge.id);
      expect(passed).toBe(true);

      const result = await challengeService.setStatusTo(
        challengeId,
        CHALLENGE_STATUS.PUBLISHED,
      );
      expect(result.status).toBe(CHALLENGE_STATUS.PUBLISHED);

      const testPage = `
        <html>
          <head>
            <title>test</title>
          </head>
          <body>
            <button id="btn-but-not-exist">not click me</button>
          </body>
        </html>
      `;
      const { id } = await assetsService.saveTextFile({
        content: testPage,
        name: 'test.html',
        mimeType: 'text/html',
      });

      const executeResult = await judgementsService.execute(challengeId, id);
      expect(executeResult.totalScore).toBe(40);
      expect(executeResult.score).toBe(0);
      expect(executeResult.passed).toBe(false);
      expect(executeResult.screenshotIdList.length).toBe(0);
      expect(executeResult.result.length).toBe(2);
    });
  });
});
