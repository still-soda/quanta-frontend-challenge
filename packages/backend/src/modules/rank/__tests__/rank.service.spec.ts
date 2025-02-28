import { Test, TestingModule } from '@nestjs/testing';
import { RankService } from '../rank.service';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { RankModule } from '../rank.module';
import { UsersModule } from '../../../modules/users/users.module';
import { AssetsModule } from '../../../modules/assets/assets.module';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import * as fs from 'fs';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

describe('RankService', () => {
  let rankService: RankService;
  let mongodb: MongoMemoryReplSet;

  beforeAll(async () => {
    mongodb = await MongoMemoryReplSet.create({
      replSet: {
        storageEngine: 'wiredTiger',
        count: 3,
      },
    });
    const mongoModule = MongooseModule.forRoot(mongodb.getUri());

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RankModule,
        UsersModule,
        AssetsModule,
        createEnvConfModule(),
        mongoModule,
      ],
      providers: [RankService],
    }).compile();

    rankService = module.get<RankService>(RankService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(rankService).toBeDefined();
  });

  describe('updateRank', () => {
    it('应该正常更新排行榜', async () => {
      const userService = rankService['userService'];

      const findAllSpy = jest
        .spyOn(userService, 'findAll')
        .mockImplementationOnce(async () => {
          return [
            { id: '1', totalScore: 100 },
            { id: '2', totalScore: 500 },
            { id: '3', totalScore: 300 },
          ] as any;
        });

      const writeFileSyncSpy = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementationOnce(async () => {});

      const result = await rankService.updateRank();
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].score).toBe(500);
      expect(result[1].score).toBe(300);
      expect(result[2].score).toBe(100);
      expect(findAllSpy).toHaveBeenCalledTimes(1);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSyncSpy.mock.calls[0][0]).toBe(
        './.temp/update-info.json',
      );

      findAllSpy.mockRestore();
      writeFileSyncSpy.mockRestore();
    });
  });

  describe('findRecent', () => {
    it('应该返回最近一次更新的排行榜', async () => {
      const rankModel = rankService['rankModel'];

      const readFileSyncSpy = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementationOnce(() => {
          return '{"recentRankDate": "2021-09-01T00:00:00.000Z"}';
        });
      readFileSyncSpy.mockClear();

      const findSpy = jest
        .spyOn(rankModel, 'find')
        .mockImplementationOnce((() => ({
          sort() {
            return [
              { userId: '2', score: 500, rank: 1 },
              { userId: '3', score: 300, rank: 2 },
              { userId: '1', score: 100, rank: 3 },
            ];
          },
        })) as any);

      const result = await rankService.findRecent();
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].score).toBe(500);
      expect(result[1].score).toBe(300);
      expect(result[2].score).toBe(100);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({
        time: new Date('2021-09-01T00:00:00.000Z'),
      });

      findSpy.mockRestore();
      readFileSyncSpy.mockRestore();
    });
  });

  describe('findSomeonesHistory', () => {
    it('应该返回某个用户的历史排名', async () => {
      const rankModel = rankService['rankModel'];

      const findSpy = jest
        .spyOn(rankModel, 'find')
        .mockImplementationOnce((() => ({
          sort() {
            return [
              {
                userId: '2',
                score: 500,
                rank: 1,
                time: new Date('2021-09-01T00:00:00.000Z'),
              },
              {
                userId: '2',
                score: 400,
                rank: 2,
                time: new Date('2021-08-01T00:00:00.000Z'),
              },
              {
                userId: '2',
                score: 300,
                rank: 3,
                time: new Date('2021-07-01T00:00:00.000Z'),
              },
            ];
          },
        })) as any);
      findSpy.mockClear();

      const result = await rankService.findSomeonesHistory('2');
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].score).toBe(500);
      expect(result[1].score).toBe(400);
      expect(result[2].score).toBe(300);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({
        userId: '2',
      });

      findSpy.mockRestore();
    });
  });

  describe('forceUpdateRank', () => {
    it('应该调用 updateRank 强制更新排行榜', async () => {
      const updateRankSpy = jest
        .spyOn(rankService, 'updateRank')
        .mockImplementationOnce(async () => true as any);

      await rankService.forceUpdateRank();
      expect(updateRankSpy).toHaveBeenCalledTimes(1);

      updateRankSpy.mockRestore();
    });
  });

  describe('findHistorySometime', () => {
    it('应该返回某个时间点的全体排名', async () => {
      const rankModel = rankService['rankModel'];

      const findSpy = jest
        .spyOn(rankModel, 'find')
        .mockImplementationOnce((() => ({
          sort() {
            return [
              {
                userId: '2',
                score: 500,
                rank: 1,
                time: new Date('2021-09-01T00:00:00.000Z'),
              },
              {
                userId: '3',
                score: 400,
                rank: 2,
                time: new Date('2021-09-01T00:00:00.000Z'),
              },
              {
                userId: '1',
                score: 300,
                rank: 3,
                time: new Date('2021-09-01T00:00:00.000Z'),
              },
            ];
          },
        })) as any);
      findSpy.mockClear();

      const result = await rankService.findHistorySometime(
        '2021-09-01T00:00:00.000Z',
      );
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].score).toBe(500);
      expect(result[1].score).toBe(400);
      expect(result[2].score).toBe(300);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({
        time: new Date('2021-08-31T16:00:00.000Z'),
      });

      findSpy.mockRestore();
    });
  });
});
