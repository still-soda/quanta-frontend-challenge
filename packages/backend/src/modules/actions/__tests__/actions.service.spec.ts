import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from '../actions.service';
import { ActionsModule } from '../actions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { CreateActionDto } from '../dto/create-action.dto';
import { randomMongoId } from '../../../utils/testing.utils';

describe('ActionsService', () => {
  let service: ActionsService;
  let mongoDb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongoDb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ActionsModule, mockDb.module],
      providers: [ActionsService],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
  });

  afterAll(async () => {
    await mongoDb.stop();
  });

  describe('create', () => {
    it('应该创建一个 Action', async () => {
      const payload = {
        imageId: 'test_image_id',
      };
      const userId = randomMongoId();
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId,
        payload
      };

      const result = await service.create(createActionDto, {
        id: userId,
        role: 0,
        username: 'test',
      });

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.type).toBe('test');
      expect(result.title).toBe('test');
      expect(result.payload).toBe(JSON.stringify(payload));
    });

    it('应该在 id 与 userId 不一致时抛出错误', async () => {
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId: randomMongoId(),
        payload: {
          imageId: 'test_image_id',
        }
      };

      await expect(service.create(createActionDto, {
        id: randomMongoId(),
        role: 0,
        username: 'test',
      })).rejects.toThrow('非超级管理员不能代替别人创建 Action');
    });
  });

  describe('findByUserId', () => {
    it('应该根据 userId 查询 Action', async () => {
      const userId = randomMongoId();
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId,
        payload: {
          imageId: 'test_image_id',
        }
      };

      const promise = []
      for (let i = 0; i < 3; i++) {
        const p = service.create(createActionDto, {
          id: userId,
          role: 0,
          username: 'test',
        });
        promise.push(p);
      }
      await Promise.all(promise);

      const result = await service.findByUserId(userId);
      expect(result).toHaveLength(3);
      expect(result[0].userId).toBe(userId);
    });
  });

  describe('update', () => {
    it('应该更新 Action 信息', async () => {
      const userId = randomMongoId();
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId,
        payload: {
          imageId: 'test_image_id',
        }
      };

      const action = await service.create(createActionDto, {
        id: userId,
        role: 0,
        username: 'test',
      });

      const updateActionDto = {
        title: 'update title',
      };

      const result = await service.update(action.id, updateActionDto, {
        id: userId,
        role: 0,
        username: 'test',
      });

      expect(result).toBeDefined();
      expect(result.title).toBe('update title');
    });

    it('应该在 id 不存在时抛出错误', async () => {
      const updateActionDto = {
        title: 'update title',
      };

      await expect(service.update(randomMongoId(), updateActionDto, {
        id: randomMongoId(),
        role: 0,
        username: 'test',
      })).rejects.toThrow('不存在 Action');
    });

    it('应该在 id 与 userId 不一致时抛出错误', async () => {
      const userId = randomMongoId();
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId,
        payload: {
          imageId: 'test_image_id',
        }
      };

      const action = await service.create(createActionDto, {
        id: userId,
        role: 0,
        username: 'test',
      });

      const updateActionDto = {
        title: 'update title',
      };

      await expect(service.update(action.id, updateActionDto, {
        id: randomMongoId(),
        role: 0,
        username: 'test',
      })).rejects.toThrow('非超级管理员不能代替别人创建 Action');
    });
  });

  describe('remove', () => {
    it('应该删除 Action 信息', async () => {
      const userId = randomMongoId();
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId,
        payload: {
          imageId: 'test_image_id',
        }
      };

      const action = await service.create(createActionDto, {
        id: userId,
        role: 0,
        username: 'test',
      });

      const result = await service.remove(action.id, {
        id: userId,
        role: 0,
        username: 'test',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(action.id);
    });

    it('应该在 id 不存在时抛出错误', async () => {
      await expect(service.remove(randomMongoId(), {
        id: randomMongoId(),
        role: 0,
        username: 'test',
      })).rejects.toThrow('不存在 Action');
    });

    it('应该在 id 与 userId 不一致时抛出错误', async () => {
      const userId = randomMongoId();
      const createActionDto: CreateActionDto = {
        type: 'test',
        title: 'test',
        userId,
        payload: {
          imageId: 'test_image_id',
        }
      };

      const action = await service.create(createActionDto, {
        id: userId,
        role: 0,
        username: 'test',
      });

      await expect(service.remove(action.id, {
        id: randomMongoId(),
        role: 0,
        username: 'test',
      })).rejects.toThrow('非超级管理员不能代替别人创建 Action');
    });
  });
});
