import { Test, TestingModule } from '@nestjs/testing';
import { CommitHeatmapService } from '../commit-heatmap.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { CommitHeatmapModule } from '../commit-heatmap.module';
import mongoose from 'mongoose';

describe('CommitHeatmapService', () => {
  let service: CommitHeatmapService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [CommitHeatmapModule, mockDb.module],
      providers: [CommitHeatmapService],
    }).compile();

    service = module.get<CommitHeatmapService>(CommitHeatmapService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取服务', () => {
    expect(service).toBeDefined();
  });

  it('应该正确查找用户的某一天的提交热力数据', async () => {
    const result = await service.findOne({
      userId: '123',
      date: '2021-01-01',
    });
    expect(result).toBeNull();

    await service.increaseHeatmapCount({
      userId: '123',
      date: '2024-01-01',
      count: 1,
    });
    const result2 = await service.findOne({
      userId: '123',
      date: '2024-01-01',
    });
    expect(result2.count).toBe(1);
  });

  it('应该正确查找用户的提交热力数据', async () => {
    const result = await service.findHeatmapByUserId('1239');
    expect(result.length).toEqual(0);
  });

  it('应该正确增加提交热力数据的次数', async () => {
    await service.increaseHeatmapCount({
      userId: '123',
      date: '2021-01-01',
      count: 1,
    });
    const result = await service.findOne({
      userId: '123',
      date: '2021-01-01',
    });
    expect(result.count).toBe(1);
  });

  it('应该正确查找用户在一段时间内的提交热力数据', async () => {
    function createHeatmap(date: string) {
      return { userId: '1234', date, count: 1 };
    }

    await service.increaseHeatmapCount(createHeatmap('2021-01-01'));
    await service.increaseHeatmapCount(createHeatmap('2021-01-02'));
    await service.increaseHeatmapCount(createHeatmap('2021-01-03'));
    await service.increaseHeatmapCount(createHeatmap('2021-01-04'));

    const result = await service.findHeatmapInRange({
      userId: '1234',
      startDate: '2021-01-02',
      endDate: '2021-01-04',
    });

    expect(result).toHaveLength(3);
  });
});
