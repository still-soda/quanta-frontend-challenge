import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from '../rank.controller';
import { RankService } from '../rank.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AssetsModule } from '../../../modules/assets/assets.module';
import { UsersModule } from '../../../modules/users/users.module';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { RankModule } from '../rank.module';
import { ROLE } from '../../../common/decorators/auth.decorator';

describe('RankController', () => {
  let controller: RankController;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RankModule,
        UsersModule,
        AssetsModule,
        createEnvConfModule(),
        mockDb.module,
      ],
      providers: [RankService],
    }).compile();

    controller = module.get<RankController>(RankController);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findRecent', () => {
    it('应该正确返回最近的排行榜', async () => {
      const findRecentServiceSpy = jest
        .spyOn(controller['rankService'], 'findRecent')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await controller.findRecent();
      expect(res).toBeDefined();
      expect(findRecentServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findMyHistory', () => {
    it('应该正确返回我的排名历史', async () => {
      const findSomeonesHistoryServiceSpy = jest
        .spyOn(controller['rankService'], 'findSomeonesHistory')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await controller.findMyHistory({
        id: '123',
        username: 'test',
        role: ROLE.USER,
      });
      expect(res).toBeDefined();
      expect(findSomeonesHistoryServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findSomeonesHistory', () => {
    it('应该正确返回某个用户的排名历史', async () => {
      const findSomeonesHistoryServiceSpy = jest
        .spyOn(controller['rankService'], 'findSomeonesHistory')
        .mockImplementationOnce((async () => ({})) as any);
      findSomeonesHistoryServiceSpy.mockClear();

      const res = await controller.findSomeonesHistory('123');
      expect(res).toBeDefined();
      expect(findSomeonesHistoryServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findSomeonesHistory', () => {
    it('应该正确返回某个用户的排名历史', async () => {
      const findSomeonesHistoryServiceSpy = jest
        .spyOn(controller['rankService'], 'findSomeonesHistory')
        .mockImplementationOnce((async () => ({})) as any);
      findSomeonesHistoryServiceSpy.mockClear();

      const res = await controller.findSomeonesHistory('123');
      expect(res).toBeDefined();
      expect(findSomeonesHistoryServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('forceUpdate', () => {
    it('应该正确触发强制更新', async () => {
      const forceUpdateServiceSpy = jest
        .spyOn(controller['rankService'], 'forceUpdateRank')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await controller.forceUpdate();
      expect(res).toBeDefined();
      expect(forceUpdateServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findHistorySometime', () => {
    it('应该正确返回某个时间的排名历史', async () => {
      const findHistorySometimeServiceSpy = jest
        .spyOn(controller['rankService'], 'findHistorySometime')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await controller.findHistorySometime(
        new Date().toISOString(),
      );
      expect(res).toBeDefined();
      expect(findHistorySometimeServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
