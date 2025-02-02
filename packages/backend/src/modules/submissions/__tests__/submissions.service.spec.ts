import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from '../submissions.service';
import { SubmissionsModule } from '../submissions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [SubmissionsModule, mockDb.module],
      providers: [SubmissionsService],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
