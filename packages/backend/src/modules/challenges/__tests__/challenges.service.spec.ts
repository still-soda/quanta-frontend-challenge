import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from '../challenges.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { ChallengesModule } from '../challenges.module';
import { CHALLENGE_STATUS } from '../../../schemas/challenges.schema';
import { ROLE } from '../../../common/decorators/auth.decorator';
import { AssetsModule } from '../../../modules/assets/assets.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { AssetsService } from '../../../modules/assets/assets.service';
import { randomMongoId } from '../../../utils/testing.utils';

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  isMongoId: jest.fn(() => true),
}));

describe('ChallengesService', () => {
  let challengesService: ChallengesService;
  let assetsService: AssetsService;
  let mockSaveTextFile: jest.SpyInstance;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ChallengesModule,
        AssetsModule,
        createEnvConfModule(),
        MongooseModule.forRoot(uri),
      ],
      providers: [ChallengesService, ChallengesModule],
    }).compile();

    challengesService = module.get<ChallengesService>(ChallengesService);
    assetsService = module.get<AssetsService>(AssetsService);
    mockSaveTextFile = jest
      .spyOn(assetsService, 'saveTextFile')
      .mockImplementation(() => {
        return Promise.resolve({ ok: true, id: 'test_id' }) as any;
      });
  });

  async function createOne(dto?: Partial<CreateChallengeDto>) {
    const result = await challengesService.create(
      { id: 'test author id', role: ROLE.ADMIN, username: 'test author' },
      {
        title: 'test challenge',
        type: 'test type',
        difficulty: 'test difficulty',
        score: 100,
        content: 'test content',
        ...dto,
      },
    );
    return result;
  }

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  describe('adminCreate', () => {
    it('应该创建一个挑战', async () => {
      mockSaveTextFile.mockClear();
      const created = await challengesService.create(
        { id: 'test author id', role: ROLE.ADMIN, username: 'test author' },
        {
          title: 'test challenge',
          type: 'test type',
          difficulty: 'test difficulty',
          score: 100,
          content: 'test content',
        },
      );
      expect(mockSaveTextFile).toHaveBeenCalledTimes(1);
      expect(created).toHaveProperty('_id');
      expect(created.title).toBe('test challenge');
      expect(created.type).toBe('test type');
      expect(created.difficulty).toBe('test difficulty');
      expect(created.authorId).toBe('test author id');
      expect(created.score).toBe(100);
      expect(created.tags).toHaveLength(0);
      expect(created.standardAnswer).toHaveLength(0);
    });
  });

  describe('findAll', () => {
    it('应该查询所有挑战（不存在已发布的）', async () => {
      const oldChallenges = await challengesService.findAll();
      await createOne();
      await createOne();
      const newChallenges = await challengesService.findAll();
      expect(newChallenges.length - oldChallenges.length).toBe(0);
    });

    it('应该查询所有挑战（已发布）', async () => {
      const oldChallenges = await challengesService.findAll();
      const a = await createOne();
      await challengesService.setStatusTo(a.id, CHALLENGE_STATUS.PUBLISHED);
      const b = await createOne();
      await challengesService.setStatusTo(b.id, CHALLENGE_STATUS.PUBLISHED);
      const newChallenges = await challengesService.findAll();
      expect(newChallenges.length - oldChallenges.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('应该查询一个挑战', async () => {
      const created = await createOne();
      const found = await challengesService.findOne(created.id);
      expect(found).toHaveProperty('_id');
      expect(found.title).toBe('test challenge');
      expect(found.type).toBe('test type');
      expect(found.difficulty).toBe('test difficulty');
      expect(found.authorId).toBe('test author id');
      expect(found.score).toBe(100);
      expect(found.tags).toHaveLength(0);
      expect(found.standardAnswer).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('应该更新一个挑战', async () => {
      const created = await createOne();
      expect(created.title).toBe('test challenge');
      const updated = await challengesService.update(
        created.id,
        { title: 'updated challenge' },
        { id: 'test author id', role: ROLE.ADMIN, username: 'test author' },
      );
      expect(updated).toHaveProperty('_id');
      expect(updated.title).toBe('updated challenge');
    });

    it('不是挑战作者不应该更新挑战', async () => {
      const created = await createOne();
      await expect(
        challengesService.update(
          created.id,
          { title: 'updated challenge' },
          {
            id: 'test author id -- not the author',
            role: ROLE.USER,
            username: 'test author',
          },
        ),
      ).rejects.toThrow('非超级管理员不能代替别人更新挑战');
    });

    it('超级管理员可以更新挑战', async () => {
      const created = await createOne();
      expect(created.title).toBe('test challenge');
      const updated = await challengesService.update(
        created.id,
        { title: 'updated challenge' },
        {
          id: 'test author id',
          role: ROLE.SUPER_ADMIN,
          username: 'test author',
        },
      );
      expect(updated).toHaveProperty('_id');
      expect(updated.title).toBe('updated challenge');
    });
  });

  describe('remove', () => {
    it('应该删除一个挑战', async () => {
      const created = await createOne();
      await challengesService.remove(created.id, {
        id: 'test author id',
        role: ROLE.ADMIN,
        username: 'test author',
      });

      const found = await challengesService.findOne(created.id);
      expect(found).toBeNull();
    });

    it('不是挑战作者不应该删除挑战', async () => {
      const created = await createOne();
      await expect(
        challengesService.remove(created.id, {
          id: 'test author id -- not the author',
          role: ROLE.USER,
          username: 'test author',
        }),
      ).rejects.toThrow('非超级管理员不能代替别人删除挑战');
    });

    it('超级管理员可以删除挑战', async () => {
      const created = await createOne();
      await challengesService.remove(created.id, {
        id: 'test author id',
        role: ROLE.SUPER_ADMIN,
        username: 'test author',
      });

      const found = await challengesService.findOne(created.id);
      expect(found).toBeNull();
    });
  });

  describe('setStandardAnswer', () => {
    it('应该正确设置标准答案', async () => {
      const created1 = await createOne();
      const updated1 = await challengesService.setStandardAnswer(created1.id, [
        '1.html',
        '2.html',
      ]);
      expect(updated1.standardAnswer).toHaveLength(2);
      const found1 = await challengesService.findOne(created1.id);
      expect(found1.standardAnswer.includes('1.html')).toBe(true);
      expect(found1.standardAnswer.includes('2.html')).toBe(true);
    });

    it('无内容应该返回 Null', async () => {
      const created = await createOne();
      const updated = await challengesService.setStandardAnswer(created.id, []);
      expect(updated).toBeNull();
      const found = await challengesService.findOne(created.id);
      expect(found.standardAnswer).toHaveLength(0);
    });

    it('内容为 Null 应该返回 Null', async () => {
      const created = await createOne();
      const updated = await challengesService.setStandardAnswer(
        created.id,
        null,
      );
      expect(updated).toBeNull();
      const found = await challengesService.findOne(created.id);
      expect(found.standardAnswer).toHaveLength(0);
    });
  });

  describe('solveChallenge', () => {
    it('解决挑战时应该正确添加最快解决者', async () => {
      const created = await createOne();
      const updated = await challengesService.solveChallenge(
        created.id,
        'teset_user_id',
      );
      expect(updated.fastestSolvers.includes('teset_user_id')).toBeTruthy();
    });

    it('在已有3个最快解决者的情况下，不应该再添加', async () => {
      const created = await createOne();
      await Promise.all([
        challengesService.solveChallenge(created.id, 'user1'),
        challengesService.solveChallenge(created.id, 'user2'),
        challengesService.solveChallenge(created.id, 'user3'),
      ]);
      const updated = await challengesService.solveChallenge(
        created.id,
        'user4',
      );
      expect(updated).toBeNull();

      const found = await challengesService.findOne(created.id);
      expect(found.fastestSolvers.includes('user4')).toBeFalsy();
      expect(found.fastestSolvers).toHaveLength(3);
    });

    it('在已经是最快解决者的情况下，不应该再添加', async () => {
      const created = await createOne();
      await challengesService.solveChallenge(created.id, 'user1');
      const updated = await challengesService.solveChallenge(
        created.id,
        'user1',
      );
      expect(updated).toBeNull();

      const found = await challengesService.findOne(created.id);
      expect(found.fastestSolvers).toHaveLength(1);
      expect(found.fastestSolvers.includes('user1')).toBeTruthy();
    });
  });

  describe('setFlowData', () => {
    it('应该正确设置流程数据', async () => {
      const created = await createOne();
      await challengesService.setFlowData(created.id, 'test_id');
      const updated = await challengesService.findOne(created.id);
      expect(updated.flowdataId).toBe('test_id');
    });
  });

  describe('setStatusTo', () => {
    it('应该正确设置状态', async () => {
      const created = await createOne();
      const updated = await challengesService.setStatusTo(
        created.id,
        CHALLENGE_STATUS.READY,
      );
      expect(updated.status).toBe(CHALLENGE_STATUS.READY);
    });

    it('如果要将状态设为 draft，则返回 null', async () => {
      const created = await createOne();
      const updated = await challengesService.setStatusTo(
        created.id,
        CHALLENGE_STATUS.DRAFT,
      );
      expect(updated).toBeNull();
    });
  });

  describe('setScreenshot', () => {
    it('应该正确设置截图', async () => {
      const created = await createOne();
      const { screenshots } = await challengesService.setScreenshot(
        created.id,
        ['test_id'],
      );
      expect(screenshots).toHaveLength(1);
      expect(screenshots.includes('test_id')).toBeTruthy();
    });
  });

  describe('switchStatus', () => {
    it('应该正确切换状态', async () => {
      const created = await createOne();
      await challengesService.setStatusTo(created.id, CHALLENGE_STATUS.READY);

      const updated = await challengesService.switchStatus(
        { id: created.id, status: CHALLENGE_STATUS.PUBLISHED },
        { id: 'test author id', role: ROLE.ADMIN, username: 'test author' },
      );
      expect(updated.status).toBe(CHALLENGE_STATUS.PUBLISHED);
    });

    it('挑战不存在应该报错', async () => {
      await expect(
        challengesService.switchStatus(
          { id: randomMongoId(), status: CHALLENGE_STATUS.PUBLISHED },
          { id: 'test author id', role: ROLE.ADMIN, username: 'test author' },
        ),
      ).rejects.toThrow('挑战不存在');
    });

    it('挑战未就绪不能切换状态', async () => {
      const created = await createOne();
      await expect(
        challengesService.switchStatus(
          { id: created.id, status: CHALLENGE_STATUS.PUBLISHED },
          { id: 'test author id', role: ROLE.ADMIN, username: 'test author' },
        ),
      ).rejects.toThrow('挑战未就绪');
    });

    it('不是挑战作者不应该切换状态', async () => {
      const created = await createOne();
      await challengesService.setStatusTo(created.id, CHALLENGE_STATUS.READY);

      await expect(
        challengesService.switchStatus(
          { id: created.id, status: CHALLENGE_STATUS.PUBLISHED },
          {
            id: 'test author id -- not the author',
            role: ROLE.USER,
            username: 'test author',
          },
        ),
      ).rejects.toThrow('非超级管理员不能代替别人更新挑战');
    });

    it('超级管理员可以切换状态', async () => {
      const created = await createOne();
      await challengesService.setStatusTo(created.id, CHALLENGE_STATUS.READY);

      const updated = await challengesService.switchStatus(
        { id: created.id, status: CHALLENGE_STATUS.PUBLISHED },
        {
          id: 'test author id',
          role: ROLE.SUPER_ADMIN,
          username: 'test author',
        },
      );
      expect(updated.status).toBe(CHALLENGE_STATUS.PUBLISHED);
    });
  });

  describe('getDetail', () => {
    it('应该返回挑战详情', async () => {
      const created = await createOne();
      await challengesService.setStatusTo(
        created.id,
        CHALLENGE_STATUS.PUBLISHED,
      );
      const mockReadTextFile = jest
        .spyOn(assetsService, 'readTextFile')
        .mockImplementation(() => {
          return Promise.resolve('test content') as any;
        });

      const detail = await challengesService.getDetail(created.id);
      expect(detail).toBe('test content');
      expect(mockReadTextFile).toHaveBeenCalledTimes(1);
      expect(mockReadTextFile).toHaveBeenCalledWith(created.contentId);
    });

    it('挑战未发布应该报错', async () => {
      const created = await createOne();
      await expect(challengesService.getDetail(created.id)).rejects.toThrow(
        '挑战不存在',
      );
    });

    it('挑战不存在应该报错', async () => {
      await expect(
        challengesService.getDetail(randomMongoId()),
      ).rejects.toThrow('挑战不存在');
    });
  });

  describe('adminGetDetail', () => {
    it('应该返回挑战详情', async () => {
      const created = await createOne();
      const detail = await challengesService.adminGetDetail(created.id, {
        role: ROLE.ADMIN,
        id: 'test author id',
        username: 'test author',
      });
      expect(detail).toHaveProperty('_id');
      expect(detail.title).toBe('test challenge');
    });

    it('不是挑战作者不应该获取挑战详情', async () => {
      const created = await createOne();
      await expect(
        challengesService.adminGetDetail(created.id, {
          role: ROLE.USER,
          id: 'test author id -- not the author',
          username: 'test author',
        }),
      ).rejects.toThrow('非超级管理员不能代替别人获取挑战详情');
    });

    it('超级管理员可以获取挑战详情', async () => {
      const created = await createOne();
      const detail = await challengesService.adminGetDetail(created.id, {
        role: ROLE.SUPER_ADMIN,
        id: 'test author id',
        username: 'test author',
      });
      expect(detail).toHaveProperty('_id');
      expect(detail.title).toBe('test challenge');
    });

    it('挑战不存在应该报错', async () => {
      await expect(
        challengesService.adminGetDetail(randomMongoId(), {
          role: ROLE.ADMIN,
          id: 'test author id',
          username: 'test author',
        }),
      ).rejects.toThrow('挑战不存在');
    });
  });
});
