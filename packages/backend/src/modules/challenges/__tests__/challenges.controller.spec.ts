import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from '../challenges.controller';
import { ChallengesService } from '../challenges.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { ChallengesModule } from '../challenges.module';
import { AssetsModule } from '../../../modules/assets/assets.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import mongoose from 'mongoose';
import { filterData } from '../../../utils/filter-data.utils';

jest.mock('../../../utils/filter-data.utils');
const mockFilterData = filterData as jest.MockedFunction<typeof filterData>;

describe('ChallengesController', () => {
  let challengesController: ChallengesController;
  let challengesService: ChallengesService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const { module: dbModule, mongodb: db } = await createMockDBModule();
    mongodb = db;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ChallengesModule,
        AssetsModule,
        createEnvConfModule(),
        dbModule,
      ],
      controllers: [ChallengesController],
      providers: [ChallengesService],
    }).compile();

    challengesController =
      module.get<ChallengesController>(ChallengesController);
    challengesService = module.get<ChallengesService>(ChallengesService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  describe('findAll', () => {
    it('应该正确调用 findAll 方法并过滤结果', async () => {
      const data = [{}, {}];
      mockFilterData.mockImplementation((_, item) => item);
      mockFilterData.mockClear();

      const mockAdminFindAll = jest
        .spyOn(challengesService, 'findAll')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockAdminFindAll.mockClear();

      const result = await challengesController.findAll();
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '获取成功',
      });
      expect(mockAdminFindAll).toHaveBeenCalledTimes(1);
      expect(mockFilterData).toHaveBeenCalledTimes(2);
    });
  });

  describe('adminFindAll', () => {
    it('应该正确调用 adminFindAll 方法并过滤结果', async () => {
      const data = [{}, {}];
      mockFilterData.mockImplementation((_, item) => item);
      mockFilterData.mockClear();

      const mockAdminFindAll = jest
        .spyOn(challengesService, 'adminFindAll')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockAdminFindAll.mockClear();

      const result = await challengesController.adminFindAll({} as any);
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '获取成功',
      });
      expect(mockAdminFindAll).toHaveBeenCalledTimes(1);
      expect(mockFilterData).toHaveBeenCalledTimes(2);
    });
  });

  describe('getDetail', () => {
    it('应该正确调用 getDetail 方法', async () => {
      const data = 'data';
      const mockGetDetail = jest
        .spyOn(challengesService, 'getDetail')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockGetDetail.mockClear();

      const result = await challengesController.getDetail('id');
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '获取成功',
      });
      expect(mockGetDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe('adminGetDetail', () => {
    it('应该正确调用 adminGetDetail 方法', async () => {
      const data = 'data';
      const mockAdminGetDetail = jest
        .spyOn(challengesService, 'adminGetDetail')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockAdminGetDetail.mockClear();

      const result = await challengesController.adminGetDetail('id', {} as any);
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '获取成功',
      });
      expect(mockAdminGetDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('应该正确调用 create 方法', async () => {
      const data = 'data';
      const mockCreate = jest
        .spyOn(challengesService, 'create')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockCreate.mockClear();

      const result = await challengesController.create({} as any, {} as any);
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '创建成功',
      });
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('应该正确调用 remove 方法', async () => {
      const data = 'data';
      const mockRemove = jest
        .spyOn(challengesService, 'remove')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockRemove.mockClear();

      const result = await challengesController.remove('id', {} as any);
      expect(result).toEqual({
        code: 200,
        data: {},
        message: '删除成功',
      });
      expect(mockRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('应该正确调用 update 方法', async () => {
      const data = 'data';
      const mockUpdate = jest
        .spyOn(challengesService, 'update')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockUpdate.mockClear();

      const result = await challengesController.update(
        'id',
        {} as any,
        {} as any,
      );
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '更新成功',
      });
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('switchStatus', () => {
    it('应该正确调用 switchStatus 方法', async () => {
      const data = 'data';
      const mockSwitchStatus = jest
        .spyOn(challengesService, 'switchStatus')
        .mockImplementation(async () => Promise.resolve(data) as any);
      mockSwitchStatus.mockClear();

      const result = await challengesController.switchStatus(
        {} as any,
        {} as any,
      );
      expect(result).toEqual({
        code: 200,
        data: data,
        message: '切换成功',
      });
      expect(mockSwitchStatus).toHaveBeenCalledTimes(1);
    });
  });
});
