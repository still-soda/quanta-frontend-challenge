import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from '../actions.controller';
import { ActionsService } from '../actions.service';
import { ActionsModule } from '../actions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';

describe('ActionsController', () => {
  let controller: ActionsController;
  let mongoDb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongoDb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ActionsModule, mockDb.module],
      controllers: [ActionsController],
      providers: [ActionsService],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  afterAll(async () => {
    await mongoDb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
