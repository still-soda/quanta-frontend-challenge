import { Test, TestingModule } from '@nestjs/testing';
import { ResolvedChallengeService } from '../resolved-challenge.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { CounterModule } from '../../../modules/counter/counter.module';
import mongoose from 'mongoose';

describe('ResolvedChallengeService', () => {
  let service: ResolvedChallengeService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [mockDb.module, CounterModule],
      providers: [ResolvedChallengeService],
    }).compile();

    service = module.get<ResolvedChallengeService>(ResolvedChallengeService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
