import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from '../assets.controller';
import { AssetsModule } from '../assets.module';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import mongoose from 'mongoose';

describe('AssetsController', () => {
  let controller: AssetsController;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [AssetsModule, createEnvConfModule(), mockDb.module],
      controllers: [AssetsController],
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取文件静态信息', async () => {
    const getFileMataDataByIdListSpy = jest
      .spyOn(controller['assetsService'], 'getFileMatadataByIdList')
      .mockImplementation(
        async () =>
          Promise.resolve([
            {
              localName: 'xxx.png',
              name: 'xxx.png',
              mimeType: 'image/png',
              xxx: 'xxx',
            },
          ]) as any,
      );

    const result = await controller.getStaticFileMetadata(['xxx']);
    expect(result.data).toEqual([
      {
        localName: 'xxx.png',
        name: 'xxx.png',
        mimeType: 'image/png',
      },
    ]);
    expect(getFileMataDataByIdListSpy).toHaveBeenCalledWith(['xxx']);
  });
});
