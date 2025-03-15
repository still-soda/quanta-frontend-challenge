import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from '../tags.controller';
import { TagsService } from '../tags.service';
import { TagsModule } from '../tags.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import mongoose from 'mongoose';

describe('TagsController', () => {
  let controller: TagsController;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [TagsModule, mockDb.module],
      controllers: [TagsController],
      providers: [TagsService],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
