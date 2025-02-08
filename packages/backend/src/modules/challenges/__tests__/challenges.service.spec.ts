import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from '../challenges.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { ChallengesModule } from '../challenges.module';
import { CHALLENGE_STATUS } from '../../../schemas/challenges.schema';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ChallengesModule, MongooseModule.forRoot(uri)],
      providers: [ChallengesService, ChallengesModule],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
  });

  async function createOne(dto?: Partial<CreateChallengeDto>) {
    return await service.create({
      title: 'test challenge',
      type: 'test type',
      difficulty: 'test difficulty',
      authorId: 'test author id',
      score: 100,
      ...dto,
    });
  }

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该被定义', () => {
    expect(service).toBeDefined();
  });

  it('应该创建一个挑战', async () => {
    const created = await createOne();
    expect(created).toHaveProperty('_id');
    expect(created.title).toBe('test challenge');
    expect(created.type).toBe('test type');
    expect(created.difficulty).toBe('test difficulty');
    expect(created.authorId).toBe('test author id');
    expect(created.score).toBe(100);
    expect(created.tags).toHaveLength(0);
    expect(created.standardAnswer).toHaveLength(0);
  });

  it('不应该创建包含CreateChallengeDto中不存在字段的挑战', async () => {
    const created = await service.create({
      title: 'test challenge',
      type: 'test type',
      difficulty: 'test difficulty',
      authorId: 'test author id',
      score: 100,
      fastestSolver: ['test user id'],
    } as any);
    expect(created.standardAnswer).toHaveLength(0);
  });

  it('应该查询所有挑战', async () => {
    const oldChallenges = await service.findAll();
    await createOne();
    await createOne();
    const newChallenges = await service.findAll();
    expect(newChallenges.length - oldChallenges.length).toBe(2);
  });

  it('应该查询一个挑战', async () => {
    const created = await createOne();
    const found = await service.findOne(created.id);
    expect(found).toHaveProperty('_id');
    expect(found.title).toBe('test challenge');
    expect(found.type).toBe('test type');
    expect(found.difficulty).toBe('test difficulty');
    expect(found.authorId).toBe('test author id');
    expect(found.score).toBe(100);
    expect(found.tags).toHaveLength(0);
    expect(found.standardAnswer).toHaveLength(0);
  });

  it('应该更新一个挑战', async () => {
    const created = await createOne();
    expect(created.title).toBe('test challenge');
    const updated = await service.update(created.id, {
      title: 'updated challenge',
    });
    expect(updated).toHaveProperty('_id');
    expect(updated.title).toBe('updated challenge');
  });

  it('不应该更新包含UpdateChallengeDto中不存在字段的挑战', async () => {
    const created = await createOne();
    const updated = await service.update(created.id, {
      standardAnswer: ['1.html'],
    } as any);
    expect(updated.standardAnswer).toHaveLength(0);
  });

  it('应该删除一个挑战', async () => {
    const created = await createOne();
    await service.remove(created.id);

    const found = await service.findOne(created.id);
    expect(found).toBeNull();
  });

  it('应该正确设置标准答案', async () => {
    // 正常设置
    const created1 = await createOne();
    const updated1 = await service.setStandardAnswer(created1.id, [
      '1.html',
      '2.html',
    ]);
    expect(updated1.standardAnswer).toHaveLength(2);
    const found1 = await service.findOne(created1.id);
    expect(found1.standardAnswer.includes('1.html')).toBe(true);
    expect(found1.standardAnswer.includes('2.html')).toBe(true);
    // 无内容
    const created2 = await createOne();
    const updated2 = await service.setStandardAnswer(created2.id, []);
    expect(updated2).toBeNull();
    const found2 = await service.findOne(created2.id);
    expect(found2.standardAnswer).toHaveLength(0);
    // null
    const created3 = await createOne();
    const updated3 = await service.setStandardAnswer(created3.id, null);
    expect(updated3).toBeNull();
    const found3 = await service.findOne(created3.id);
    expect(found3.standardAnswer).toHaveLength(0);
  });

  it('解决挑战时应该正确添加最快解决者', async () => {
    const created = await createOne();
    const updated = await service.solveChallenge(created.id, 'teset_user_id');
    expect(updated.fastestSolvers.includes('teset_user_id')).toBeTruthy();
  });

  it('在已有3个最快解决者的情况下，不应该再添加', async () => {
    const created = await createOne();
    await Promise.all([
      service.solveChallenge(created.id, 'user1'),
      service.solveChallenge(created.id, 'user2'),
      service.solveChallenge(created.id, 'user3'),
    ]);
    const updated = await service.solveChallenge(created.id, 'user4');
    expect(updated).toBeNull();

    const found = await service.findOne(created.id);
    expect(found.fastestSolvers.includes('user4')).toBeFalsy();
    expect(found.fastestSolvers).toHaveLength(3);
  });

  it('在已经是最快解决者的情况下，不应该再添加', async () => {
    const created = await createOne();
    await service.solveChallenge(created.id, 'user1');
    const updated = await service.solveChallenge(created.id, 'user1');
    expect(updated).toBeNull();

    const found = await service.findOne(created.id);
    expect(found.fastestSolvers).toHaveLength(1);
    expect(found.fastestSolvers.includes('user1')).toBeTruthy();
  });

  it('应该正确设置流程数据', async () => {
    const created = await createOne();
    await service.setFlowData(created.id, 'test_id');
    const updated = await service.findOne(created.id);
    expect(updated.flowdataId).toBe('test_id');
  });

  describe('应该正确设置状态', () => {
    it('应该正确设置为 ready 状态', async () => {
      const created = await createOne();
      const updated = await service.setStatusToReady(created.id);
      expect(updated.status).toBe(CHALLENGE_STATUS.READY);
    });

    it('如果状态不是 draft，不应该设置为 ready 状态', async () => {
      const created = await createOne();
      const updated = await service.setStatusToReady(created.id);
      expect(updated.status).toBe(CHALLENGE_STATUS.READY);
      const updated2 = await service.setStatusToReady(created.id);
      expect(updated2).toBeNull();
      const found = await service.findOne(created.id);
      expect(found.status).toBe(CHALLENGE_STATUS.READY);
    });

    it('应该正确设置为 published 状态', async () => {
      const created = await createOne();
      await service.setStatusToReady(created.id);
      const updated = await service.setStatusToPublished(created.id);
      expect(updated.status).toBe(CHALLENGE_STATUS.PUBLISHED);
    });

    it('如果状态不是 ready，不应该设置为 published 状态', async () => {
      const created = await createOne();
      const updated = await service.setStatusToPublished(created.id);
      expect(updated).toBeNull();
      const found = await service.findOne(created.id);
      expect(found.status).toBe(CHALLENGE_STATUS.DRAFT);
    });

    it('应该正确设置为 closed 状态', async () => {
      const created = await createOne();
      await service.setStatusToReady(created.id);
      await service.setStatusToPublished(created.id);
      const updated = await service.setStatusToClosed(created.id);
      expect(updated.status).toBe(CHALLENGE_STATUS.CLOSED);
    });

    it('如果状态不是 published，不应该设置为 closed 状态', async () => {
      const created = await createOne();
      const updated = await service.setStatusToClosed(created.id);
      expect(updated).toBeNull();
      const found = await service.findOne(created.id);
      expect(found.status).toBe(CHALLENGE_STATUS.DRAFT);
    });
  });

  it('应该正确设置截图', async () => {
    const created = await createOne();
    const { screenshots } = await service.setScreenshot(created.id, [
      'test_id',
    ]);
    expect(screenshots).toHaveLength(1);
    expect(screenshots.includes('test_id')).toBeTruthy();
  });
});
