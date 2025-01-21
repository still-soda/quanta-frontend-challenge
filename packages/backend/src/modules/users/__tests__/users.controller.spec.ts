import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { UsersModule } from '../users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('UsersController', () => {
  let controller: UsersController;
  let mongodb: MongoMemoryServer;

  beforeEach(async () => {
    const { module: dbModule, mongodb: db } = await createMockDBModule();
    mongodb = db;

    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, dbModule],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
