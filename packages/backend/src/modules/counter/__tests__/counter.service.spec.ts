import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from '../counter.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import mongoose from 'mongoose';
import { CounterModule } from '../counter.module';

describe('CounterService', () => {
  let service: CounterService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [CounterModule, mockDb.module],
      providers: [CounterService],
    }).compile();

    service = module.get<CounterService>(CounterService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确递增数据', async () => {
    const sequenceName = 'test';
    const value1 = await service.nextValue(sequenceName);
    const value2 = await service.nextValue(sequenceName);

    expect(value1).toBe(1);
    expect(value2).toBe(2);
  });

  it('应该正确递增不同的数据', async () => {
    const sequenceName1 = 'test1';
    const sequenceName2 = 'test2';
    const value1 = await service.nextValue(sequenceName1);
    const value2 = await service.nextValue(sequenceName2);

    expect(value1).toBe(1);
    expect(value2).toBe(1);
  });

  it('应该正确获取当前值', async () => {
    const sequenceName = 'test4';
    await service.nextValue(sequenceName);
    const value = await service.currentValue(sequenceName);

    expect(value).toBe(1);
  });

  it('应该正确重置数据', async () => {
    const sequenceName = 'test';
    await service.nextValue(sequenceName);
    await service.reset(sequenceName);
    const value = await service.currentValue(sequenceName);

    expect(value).toBe(0);
  });
});
