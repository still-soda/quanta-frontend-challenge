import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { AssetsModule } from '../../../modules/assets/assets.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { AssetsService } from '../../../modules/assets/assets.service';
import mongoose from 'mongoose';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import validateData from '../../../utils/validate-data.utils';
import { NotificationsModule } from '../notifications.module';
import { ROLE } from '../../../common/decorators/auth.decorator';
import { randomMongoId } from '../../../utils/testing.utils';

jest.mock('../../../utils/validate-data.utils');
const mockValidateData = validateData as jest.MockedFunction<
  typeof validateData
>;

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let assetsService: AssetsService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NotificationsModule,
        mockDb.module,
        AssetsModule,
        createEnvConfModule(),
      ],
      providers: [NotificationsService],
    }).compile();

    notificationsService =
      module.get<NotificationsService>(NotificationsService);
    assetsService = module.get<AssetsService>(AssetsService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取服务', () => {
    expect(notificationsService).toBeDefined();
    expect(assetsService).toBeDefined();
  });

  describe('create', () => {
    it('应该正确创建公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const id = randomMongoId();
      let mockSaveTextFile = jest
        .spyOn(assetsService, 'saveTextFile')
        .mockImplementation(async () =>
          Promise.resolve({ ok: true, id, fileName: 'test.md' }),
        );

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: `1:${id}`,
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: `1:${id}`, role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );
      expect(result.title).toBe(createNotificationDto.title);
      expect(result.description).toBe(createNotificationDto.description);
      expect(result.authorId).toBe(createNotificationDto.authorId);
      expect(result.contentId).toBe(id);

      expect(mockSaveTextFile).toHaveBeenCalledTimes(1);
      expect(mockSaveTextFile).toHaveBeenCalledWith({
        content: '文章内容',
        name: 'Solve Challenge.md',
        mimeType: 'text/markdown',
      });

      mockSaveTextFile.mockRestore();
    });

    it('用户ID与作者ID不一致时应该抛出错误', async () => {
      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '2:123456',
        content: '文章内容',
      };

      await expect(
        notificationsService.create(
          { id: '2:123456', role: ROLE.ADMIN, username: 'test' },
          {
            ...createNotificationDto,
            authorId: '2:654321',
          },
        ),
      ).rejects.toThrow('非超级管理员无法代替他人创建公告');
    });

    it('当用户是超级管理员时应该可以创建任何公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      let mockSaveTextFile = jest
        .spyOn(assetsService, 'saveTextFile')
        .mockImplementation(async () =>
          Promise.resolve({ ok: true, id: '123456', fileName: 'test.md' }),
        );

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '3:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '3:123456', role: ROLE.SUPER_ADMIN, username: 'test' },
        createNotificationDto,
      );
      expect(result.title).toBe(createNotificationDto.title);
      expect(result.description).toBe(createNotificationDto.description);
      expect(result.authorId).toBe(createNotificationDto.authorId);
      expect(result.contentId).toBe('123456');

      expect(mockSaveTextFile).toHaveBeenCalledTimes(1);
      expect(mockSaveTextFile).toHaveBeenCalledWith({
        content: '文章内容',
        name: 'Solve Challenge.md',
        mimeType: 'text/markdown',
      });

      mockSaveTextFile.mockRestore();
    });

    it('保存文章失败时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      let mockSaveTextFile = jest
        .spyOn(assetsService, 'saveTextFile')
        .mockImplementation(async () =>
          Promise.resolve({ ok: false, id: '123456', fileName: 'test.md' }),
        );

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '4:123456',
        content: '文章内容',
      };

      await expect(
        notificationsService.create(
          { id: '4:123456', role: ROLE.ADMIN, username: 'test' },
          createNotificationDto,
        ),
      ).rejects.toThrow('保存文章文件失败');

      expect(mockSaveTextFile).toHaveBeenCalledTimes(1);
      expect(mockSaveTextFile).toHaveBeenCalledWith({
        content: '文章内容',
        name: 'Solve Challenge.md',
        mimeType: 'text/markdown',
      });

      mockSaveTextFile.mockRestore();
    });

    it('DTO数据校验失败时应该抛出错误', async () => {
      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '5:123456',
        content: '',
      };

      mockValidateData.mockImplementationOnce(() => {
        throw new Error('文章内容不能为空');
      });

      await expect(
        notificationsService.create(
          { id: '5:123456', role: ROLE.ADMIN, username: 'test' },
          {
            ...createNotificationDto,
            title: '',
          },
        ),
      ).rejects.toThrow('文章内容不能为空');

      mockValidateData.mockRestore();
    });
  });

  describe('findAllPublished', () => {
    it('应该正确获取所有公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const mockFindOne = jest
        .spyOn(notificationsService, 'findOne')
        .mockImplementation(async () => {
          return Promise.resolve({
            title: 'Solve Challenge',
            description: '这是公告简介',
            authorId: '123456',
            content: '文章内容',
          }) as any;
        });

      const notification = await notificationsService.create(
        { id: '6:123456', role: ROLE.ADMIN, username: 'test' },
        {
          title: 'Solve Challenge',
          description: '这是公告简介',
          authorId: '6:123456',
          content: '文章内容',
        },
      );

      await notificationsService.switchStatus(
        { id: '6:123456', role: ROLE.ADMIN, username: 'test' },
        { id: notification.id, status: 'published' },
      );

      const result = await notificationsService.findAllPublished();
      expect(result.length).toBeGreaterThan(0);

      mockFindOne.mockRestore();
    });

    it('未找到已发布的公告时应该返回空数组', async () => {
      const mockFind = jest
        .spyOn(notificationsService['notificationsModel'], 'find')
        .mockImplementation(() => {
          return Promise.resolve([]) as any;
        });

      const result = await notificationsService.findAllPublished();
      expect(result.length).toBe(0);

      mockValidateData.mockImplementation(() => {
        throw new Error('未找到已发布的公告');
      });

      mockFind.mockRestore();
    });
  });

  describe('findOne', () => {
    it('应该正确获取指定ID的公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '7:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '7:123456', role: ROLE.ADMIN, username: 'test' },

        createNotificationDto,
      );
      const findResult = await notificationsService.findOne(result.id);
      expect(findResult.title).toBe(createNotificationDto.title);
      expect(findResult.description).toBe(createNotificationDto.description);
      expect(findResult.authorId).toBe(createNotificationDto.authorId);
    });

    it('未找到指定ID的公告时应该返回null', async () => {
      const findResult = await notificationsService.findOne(
        '6756f5605fe86d4166703162',
      );
      expect(findResult).toBeNull();
    });
  });

  describe('userUpdate', () => {
    it('应该正确更新指定ID的公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '9:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '9:123456', role: ROLE.ADMIN, username: 'test' },

        createNotificationDto,
      );
      const updateResult = await notificationsService.userUpdate(
        result.id,
        { id: '9:123456', role: ROLE.ADMIN, username: 'test' },
        {
          title: 'New Title',
          description: 'New Description',
        },
      );

      expect(updateResult.title).toBe('New Title');
      expect(updateResult.description).toBe('New Description');
    });

    it('用户ID与作者ID不一致时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '10:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '10:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      await expect(
        notificationsService.userUpdate(
          result.id,
          { id: '10:1234567', role: ROLE.ADMIN, username: 'test' },
          {
            title: 'New Title',
            description: 'New Description',
          },
        ),
      ).rejects.toThrow('非超级管理员无法代替他人更新公告');
    });

    it('当用户是超级管理员时应该可以更新任何公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '11:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '11:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const updateResult = await notificationsService.userUpdate(
        result.id,
        { id: '11:1234567', role: ROLE.SUPER_ADMIN, username: 'test' },
        {
          title: 'New Title',
          description: 'New Description',
        },
      );

      expect(updateResult.title).toBe('New Title');
      expect(updateResult.description).toBe('New Description');
    });

    it('未找到指定ID的公告时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const promise = notificationsService.userUpdate(
        '6756f5605fe86d4166703162',
        { id: '12:123456', role: ROLE.ADMIN, username: 'test' },
        {
          title: 'New Title',
          description: 'New Description',
        },
      );

      await expect(promise).rejects.toThrow('公告不存在');
    });
  });

  describe('switchStatus', () => {
    it('应该正确切换指定ID的公告状态', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '13:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '13:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );
      expect(result.status).toBe('draft');

      const switchResult = await notificationsService.switchStatus(
        { id: '13:123456', role: ROLE.ADMIN, username: 'test' },
        { id: result.id, status: 'published' },
      );
      expect(switchResult.status).toBe('published');
    });

    it('用户ID与作者ID不一致时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '14:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '14:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      await expect(
        notificationsService.switchStatus(
          { id: '14:1234567', role: ROLE.ADMIN, username: 'test' },
          { id: result.id, status: 'published' },
        ),
      ).rejects.toThrow('非超级管理员无法代替他人更新公告');
    });

    it('当用户是超级管理员时应该可以更新任何公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '15:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '15:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const switchResult = await notificationsService.switchStatus(
        { id: '15:1234567', role: ROLE.SUPER_ADMIN, username: 'test' },
        { id: result.id, status: 'published' },
      );
      expect(switchResult.status).toBe('published');
    });

    it('未找到指定ID的公告时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const promise = notificationsService.switchStatus(
        { id: '16:123456', role: ROLE.ADMIN, username: 'test' },
        { id: '6756f5605fe86d4166703162', status: 'published' },
      );

      await expect(promise).rejects.toThrow('公告不存在');
    });

    it('状态不合法时应该抛出错误', async () => {
      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '17:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '17:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      mockValidateData.mockImplementation(() => {
        throw new Error('状态不合法');
      });

      const promise = notificationsService.switchStatus(
        { id: '17:123456', role: ROLE.ADMIN, username: 'test' },
        { id: result.id, status: 'test' as any },
      );

      await expect(promise).rejects.toThrow('状态不合法');
    });
  });

  describe('userGetDetail', () => {
    it('应该正确获取指定ID的公告内容', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const mockFindById = jest
        .spyOn(notificationsService, 'findOne')
        .mockImplementation(async () => {
          return Promise.resolve({
            title: 'Solve Challenge',
            description: '这是公告简介',
            authorId: '123456',
            content: '文章内容',
          }) as any;
        });
      const mockReadTextById = jest
        .spyOn(assetsService, 'readTextFileById')
        .mockImplementation(async () => {
          return Promise.resolve('文章内容');
        });
      const mockSaveTextFile = jest
        .spyOn(assetsService, 'saveTextFile')
        .mockImplementation(async () =>
          Promise.resolve({ ok: true, id: '6666', fileName: 'test.md' }),
        );

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '18:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '18:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      await notificationsService.switchStatus(
        { id: '18:123456', role: ROLE.ADMIN, username: 'test' },
        { id: result.id, status: 'published' },
      );

      const detail = await notificationsService.userGetDetail(result.id);
      expect(detail).toBe('文章内容');
      expect(mockReadTextById).toHaveBeenCalledTimes(1);
      expect(mockReadTextById).toHaveBeenCalledWith(result.contentId);

      mockReadTextById.mockRestore();
      mockSaveTextFile.mockRestore();
      mockFindById.mockRestore();
    });

    it('未找到指定ID的公告时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const promise = notificationsService.userGetDetail(
        '6756f5605fe86d4166703162',
      );

      await expect(promise).rejects.toThrow('公告不存在');
    });

    it('ID无效时应该抛出错误', async () => {
      mockValidateData.mockImplementation(() => {
        throw new Error('ID无效');
      });

      const promise = notificationsService.userGetDetail('20:test');

      await expect(promise).rejects.toThrow('ID无效');
    });
  });

  describe('adminGetDetail', () => {
    it('应该正确获取指定ID的公告内容', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const mockFindById = jest
        .spyOn(notificationsService, 'findOne')
        .mockImplementation(async () => {
          return Promise.resolve({
            title: 'Solve Challenge',
            description: '这是公告简介',
            authorId: '123456',
            content: '文章内容',
          }) as any;
        });
      const mockReadTextById = jest
        .spyOn(assetsService, 'readTextFileById')
        .mockImplementation(async () => {
          return Promise.resolve('文章内容');
        });

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '21:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '21:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const detail = await notificationsService.adminGetDetail(result.id, {
        id: '21:123456',
        role: ROLE.ADMIN,
        username: 'test',
      });
      expect(detail).toBe('文章内容');
      expect(mockReadTextById).toHaveBeenCalledTimes(1);
      expect(mockReadTextById).toHaveBeenCalledWith(result.contentId);

      mockReadTextById.mockRestore();
      mockFindById.mockRestore();
    });

    it('未找到指定ID的公告时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const promise = notificationsService.adminGetDetail(
        '6756f5605fe86d4166703162',
        { id: '22:123456', role: ROLE.ADMIN, username: 'test' },
      );

      await expect(promise).rejects.toThrow('公告不存在');
    });

    it('ID无效时应该抛出错误', async () => {
      mockValidateData.mockImplementation(() => {
        throw new Error('ID无效');
      });

      const promise = notificationsService.adminGetDetail('23:test', {
        id: '23:123456',
        role: ROLE.ADMIN,
        username: 'test',
      });

      await expect(promise).rejects.toThrow('ID无效');
    });

    it('在获取他人未发布的公告时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '24:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '24:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const promise = notificationsService.adminGetDetail(result.id, {
        id: '24:1234567',
        role: ROLE.ADMIN,
        username: 'test',
      });

      await expect(promise).rejects.toThrow(
        '非超级管理员无法获取他人未发布的公告',
      );
    });

    it('超级管理员可以获取他人未发布的公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '25:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '25:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const detail = await notificationsService.adminGetDetail(result.id, {
        id: '25:1234567~',
        role: ROLE.SUPER_ADMIN,
        username: 'test',
      });
      expect(detail).toBe('文章内容');
    });
  });

  describe('remove', () => {
    it('应该正确删除指定ID的公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const mockFindById = jest
        .spyOn(notificationsService, 'findOne')
        .mockImplementation(async () => {
          return Promise.resolve({
            title: 'Solve Challenge',
            description: '这是公告简介',
            authorId: '123456',
            content: '文章内容',
          }) as any;
        });
      const mockDeleteTextById = jest
        .spyOn(assetsService, 'deleteFile')
        .mockImplementation(async () => {
          return Promise.resolve(true);
        });

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '26:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '26:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const deleteResult = await notificationsService.remove(result.id, {
        id: '26:123456',
        role: ROLE.ADMIN,
        username: 'test',
      });
      expect(deleteResult).toHaveProperty('id', result.id);
      expect(deleteResult).toHaveProperty('title', result.title);
      expect(deleteResult).toHaveProperty('description', result.description);

      expect(mockDeleteTextById).toHaveBeenCalledTimes(1);
      expect(mockDeleteTextById).toHaveBeenCalledWith(result.contentId);

      mockDeleteTextById.mockRestore();
      mockFindById.mockRestore();
    });

    it('未找到指定ID的公告时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const promise = notificationsService.remove('6756f5605fe86d4166703162', {
        id: '27:123456',
        role: ROLE.ADMIN,
        username: 'test',
      });

      await expect(promise).rejects.toThrow('公告不存在');
    });

    it('ID无效时应该抛出错误', async () => {
      mockValidateData.mockImplementation(() => {
        throw new Error('ID无效');
      });

      const promise = notificationsService.remove('28:test', {
        id: '28:123456',
        role: ROLE.ADMIN,
        username: 'test',
      });

      await expect(promise).rejects.toThrow('ID无效');
    });

    it('用户ID与作者ID不一致时应该抛出错误', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '29:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '29:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const promise = notificationsService.remove(result.id, {
        id: '29:1234567',
        role: ROLE.ADMIN,
        username: 'test',
      });

      await expect(promise).rejects.toThrow('非超级管理员无法代替他人删除公告');
    });

    it('当用户是超级管理员时应该可以删除任何公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const createNotificationDto: CreateNotificationDto = {
        title: 'Solve Challenge',
        description: '这是公告简介',
        authorId: '30:123456',
        content: '文章内容',
      };

      const result = await notificationsService.create(
        { id: '30:123456', role: ROLE.ADMIN, username: 'test' },
        createNotificationDto,
      );

      const deleteResult = await notificationsService.remove(result.id, {
        id: '30:1234567',
        role: ROLE.SUPER_ADMIN,
        username: 'test',
      });
      expect(deleteResult).toHaveProperty('id', result.id);
      expect(deleteResult).toHaveProperty('title', result.title);
      expect(deleteResult).toHaveProperty('description', result.description);
    });
  });

  describe('adminFindAll', () => {
    it('应该正确获取所有公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      const mockFindOne = jest
        .spyOn(notificationsService, 'findOne')
        .mockImplementation(async () => {
          return Promise.resolve({
            title: 'Solve Challenge',
            description: '这是公告简介',
            authorId: '123124421=',
            content: '文章内容',
          }) as any;
        });

      await notificationsService.create(
        { id: '31:123124421=', role: ROLE.ADMIN, username: 'test' },
        {
          title: 'Solve Challenge',
          description: '这是公告简介',
          authorId: '31:123124421=',
          content: '文章内容',
        },
      );

      const result = await notificationsService.adminFindAll({
        id: '31:123124421=',
        role: ROLE.ADMIN,
        username: 'test',
      });
      expect(result.length).toBeGreaterThan(0);

      mockFindOne.mockRestore();
    });

    it('不应该获取他人未发布的公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      await notificationsService.create(
        { id: '123124421--', role: ROLE.ADMIN, username: 'test' },
        {
          title: 'Solve Challenge',
          description: '这是公告简介',
          authorId: '123124421--',
          content: '文章内容',
        },
      );

      const notifications = await notificationsService.adminFindAll({
        id: '123124421-',
        role: ROLE.ADMIN,
        username: 'test',
      });

      expect(notifications.length).toBe(0);
    });

    it('超级管理员可以获取他人未发布的公告', async () => {
      mockValidateData.mockImplementation((_, data) => Promise.resolve(data));

      await notificationsService.create(
        { id: '123124421--', role: ROLE.ADMIN, username: 'test' },
        {
          title: 'Solve Challenge',
          description: '这是公告简介',
          authorId: '123124421--',
          content: '文章内容',
        },
      );

      const result = await notificationsService.adminFindAll({
        id: '123124421@',
        role: ROLE.SUPER_ADMIN,
        username: 'test',
      });
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
