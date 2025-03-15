import { Test, TestingModule } from '@nestjs/testing';
import { ResolvedChallengeController } from '../resolved-challenge.controller';
import { ResolvedChallengeService } from '../resolved-challenge.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { CounterModule } from '../../../modules/counter/counter.module';
import mongoose from 'mongoose';

describe('ResolvedChallengeController', () => {
  let controller: ResolvedChallengeController;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [mockDb.module, CounterModule],
      controllers: [ResolvedChallengeController],
      providers: [ResolvedChallengeService],
    }).compile();

    controller = module.get<ResolvedChallengeController>(
      ResolvedChallengeController,
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
