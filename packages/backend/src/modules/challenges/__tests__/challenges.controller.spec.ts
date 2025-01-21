import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from '../challenges.controller';
import { ChallengesService } from '../challenges.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { ChallengesModule } from '../challenges.module';

describe('ChallengesController', () => {
  let controller: ChallengesController;
  let mongodb: MongoMemoryServer;

  beforeEach(async () => {
    const { module: dbModule, mongodb: db } = await createMockDBModule();
    mongodb = db;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ChallengesModule, dbModule],
      controllers: [ChallengesController],
      providers: [ChallengesService],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
