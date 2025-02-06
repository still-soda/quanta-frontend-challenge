import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { UsersModule } from '../users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AssetsModule } from '../../../modules/assets/assets.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import mongoose from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const { module: dbModule, mongodb: db } = await createMockDBModule();
    mongodb = db;

    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AssetsModule, dbModule, createEnvConfModule()],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
