import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from '../challenges.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { ChallengesModule } from '../challenges.module';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 创建
  it('should create a challenge', async () => {
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

  // 查询所有
  it('should find all challenges', async () => {
    const oldChallenges = await service.findAll();
    await createOne();
    await createOne();
    const newChallenges = await service.findAll();
    expect(newChallenges.length - oldChallenges.length).toBe(2);
  });

  // 查询一个
  it('should find one challenge', async () => {
    const created = await createOne();
    const found = await service.findOne(created._id.toString());
    expect(found).toHaveProperty('_id');
    expect(found.title).toBe('test challenge');
    expect(found.type).toBe('test type');
    expect(found.difficulty).toBe('test difficulty');
    expect(found.authorId).toBe('test author id');
    expect(found.score).toBe(100);
    expect(found.tags).toHaveLength(0);
    expect(found.standardAnswer).toHaveLength(0);
  });

  // 更新
  it('should update a challenge', async () => {
    const created = await createOne();
    expect(created.title).toBe('test challenge');
    const updated = await service.update(created._id.toString(), {
      title: 'updated challenge',
    });
    expect(updated).toHaveProperty('_id');
    expect(updated.title).toBe('updated challenge');
  });

  // 更新不在UpdatedDto中的字段不应该成功
  it('should not update a challenge with fields not in UpdateChallengeDto', async () => {
    const created = await createOne();
    const updated = await service.update(created._id.toString(), {
      standardAnswer: ['1.html'],
    } as any);
    expect(updated.standardAnswer).toHaveLength(0);
  });

  // 删除
  it('should remove a challenge', async () => {
    const created = await createOne();
    await service.remove(created._id.toString());

    const found = await service.findOne(created._id.toString());
    expect(found).toBeNull();
  });

  // 应该正确设置标准答案
  it('should set standard answer correctly', async () => {
    // 正常设置
    const created1 = await createOne();
    const updated1 = await service.setStandardAnswer(created1._id.toString(), [
      '1.html',
      '2.html',
    ]);
    expect(updated1.standardAnswer).toHaveLength(2);
    // 无内容
    const created2 = await createOne();
    const updated2 = await service.setStandardAnswer(
      created2._id.toString(),
      [],
    );
    expect(updated2).toBeNull();
    // null
    const created3 = await createOne();
    const updated3 = await service.setStandardAnswer(
      created3._id.toString(),
      null,
    );
    expect(updated3).toBeNull();
  });
});
