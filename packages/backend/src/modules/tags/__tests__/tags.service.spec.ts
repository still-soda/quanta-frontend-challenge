import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from '../tags.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { TagsModule } from '../tags.module';
import mongoose from 'mongoose';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { AssetsModule } from '../../../modules/assets/assets.module';

describe('TagsService', () => {
  let service: TagsService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TagsModule,
        mockDb.module,
        createEnvConfModule('.env.devlopment'),
        AssetsModule,
      ],
      providers: [TagsService],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
