import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsController } from '../submissions.controller';
import { SubmissionsService } from '../submissions.service';
import { SubmissionsModule } from '../submissions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { CommitHeatmapModule } from '../../../modules/commit-heatmap/commit-heatmap.module';

describe('SubmissionsController', () => {
  let controller: SubmissionsController;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [SubmissionsModule, CommitHeatmapModule, mockDb.module],
      controllers: [SubmissionsController],
      providers: [SubmissionsService],
    }).compile();

    controller = module.get<SubmissionsController>(SubmissionsController);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
