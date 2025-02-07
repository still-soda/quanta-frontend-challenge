import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../notifications.controller';
import { NotificationsService } from '../notifications.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { NotificationsModule } from '../notifications.module';
import { AssetsModule } from '../../../modules/assets/assets.module';
import mongoose from 'mongoose';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;
  let mongodb: MongoMemoryServer;
  let notificationService: NotificationsService;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NotificationsModule,
        AssetsModule,
        mockDb.module,
        createEnvConfModule(),
      ],
      controllers: [NotificationsController],
      providers: [NotificationsService],
    }).compile();

    notificationsController = module.get<NotificationsController>(
      NotificationsController,
    );
    notificationService =
      module.get<NotificationsService>(NotificationsService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取模块', () => {
    expect(notificationsController).toBeDefined();
    expect(notificationService).toBeDefined();
  });

  describe('create', () => {
    it('应该正确创建公告', async () => {
      const createNotificationDto = {
        title: 'test',
        description: 'test',
        authorId: 'test',
        content: 'test',
        coverUrl: 'test',
      };
      const user = {
        id: 'test',
        username: 'test',
        role: 1,
      };
      const result = {};

      const mockCreate = jest
        .spyOn(notificationService, 'create')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.create(createNotificationDto, user),
      ).resolves.toHaveProperty('data', result);
      expect(mockCreate).toHaveBeenCalledWith(user, createNotificationDto);

      mockCreate.mockRestore();
    });
  });

  describe('remove', () => {
    it('应该正确删除公告', async () => {
      const id = 'test';
      const user = {
        id: 'test',
        username: 'test',
        role: 1,
      };
      const result = {};

      const mockDelete = jest
        .spyOn(notificationService, 'remove')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.delete(id, user),
      ).resolves.toHaveProperty('data', result);
      expect(mockDelete).toHaveBeenCalledWith(id, user);

      mockDelete.mockRestore();
    });
  });

  describe('update', () => {
    it('应该正确更新公告', async () => {
      const id = 'test';
      const createNotificationDto = {
        title: 'test',
        description: 'test',
        content: 'test',
        coverUrl: 'test',
      };
      const user = {
        id: 'test',
        username: 'test',
        role: 1,
      };
      const result = {};

      const mockUpdate = jest
        .spyOn(notificationService, 'userUpdate')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.update(id, createNotificationDto, user),
      ).resolves.toHaveProperty('data', result);
      expect(mockUpdate).toHaveBeenCalledWith(id, user, createNotificationDto);

      mockUpdate.mockRestore();
    });
  });

  describe('switchStatus', () => {
    it('应该正确切换公告状态（发布）', async () => {
      const id = 'test';
      const user = {
        id: 'test',
        username: 'test',
        role: 1,
      };
      const result = {};

      const mockSwitch = jest
        .spyOn(notificationService, 'switchStatus')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.switchStatus({ id, status: 'published' }, user),
      ).resolves.toHaveProperty('message', '发布成功');

      mockSwitch.mockRestore();
    });

    it('应该正确切换公告状态（撤回）', async () => {
      const id = 'test';
      const user = {
        id: 'test',
        username: 'test',
        role: 1,
      };
      const result = {};

      const mockSwitch = jest
        .spyOn(notificationService, 'switchStatus')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.switchStatus({ id, status: 'draft' }, user),
      ).resolves.toHaveProperty('message', '撤回成功');

      mockSwitch.mockRestore();
    });
  });

  describe('adminFindAll', () => {
    it('应该正确获取所有公告', async () => {
      const result = {};

      const mockFindAll = jest
        .spyOn(notificationService, 'adminFindAll')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.adminFindAll({
          id: 'test',
          role: 1,
          username: 'test',
        }),
      ).resolves.toHaveProperty('data', result);

      mockFindAll.mockRestore();
    });
  });

  describe('findAllPublished', () => {
    it('应该正确获取所有已发布的公告', async () => {
      const result = {};

      const mockFindAllPublished = jest
        .spyOn(notificationService, 'findAllPublished')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.findAllPublished(),
      ).resolves.toHaveProperty('data', result);

      mockFindAllPublished.mockRestore();
    });
  });

  describe('adminGetDetail', () => {
    it('应该正确获取公告详情', async () => {
      const id = 'test';
      const user = {
        id: 'test',
        username: 'test',
        role: 1,
      };
      const result = {};

      const mockGetDetail = jest
        .spyOn(notificationService, 'adminGetDetail')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.adminGetDetail(id, user),
      ).resolves.toHaveProperty('data', result);

      mockGetDetail.mockRestore();
    });
  });

  describe('getDetail', () => {
    it('应该正确获取公告详情', async () => {
      const id = 'test';
      const result = {};

      const mockGetDetail = jest
        .spyOn(notificationService, 'userGetDetail')
        .mockImplementation(() => Promise.resolve(result) as any);

      await expect(
        notificationsController.getDetail(id),
      ).resolves.toHaveProperty('data', result);

      mockGetDetail.mockRestore();
    });
  });
});
