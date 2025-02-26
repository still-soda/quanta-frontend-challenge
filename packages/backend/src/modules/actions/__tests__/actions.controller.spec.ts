import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from '../actions.controller';
import { ActionsService } from '../actions.service';
import { ActionsModule } from '../actions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { ROLE } from '../../../common/decorators/auth.decorator';

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

  describe('findAll', () => {
    it('应该正确返回用户的所有 Action', async () => {
      const actionService = controller['actionsService'];
      const mockResult = [
        { id: 'test_id', type: 'test', title: 'test', payload: '{}' }
      ];

      const mockFind = jest
        .spyOn(actionService, 'findByUserId')
        .mockImplementationOnce(() => mockResult as any);

      const result = await controller.findAll({
        id: 'test_id',
        username: 'test',
        role: ROLE.USER,
      });

      expect(result).toEqual({
        code: 200,
        message: '获取成功',
        data: mockResult,
      });
      expect(mockFind).toHaveBeenCalledTimes(1);
    });
  })

  describe('getAction', () => {
    it('应该正确返回 Action 信息', async () => {
      const actionService = controller['actionsService'];
      const mockResult = [
        { id: 'test_id', type: 'test', title: 'test', payload: '{}' }
      ];

      const mockFind = jest
        .spyOn(actionService, 'findByUserId')
        .mockImplementationOnce(() => mockResult as any);
      mockFind.mockClear();

      const result = await controller.findAllById('test_id');

      expect(result).toEqual({
        code: 200,
        message: '获取成功',
        data: mockResult,
      });
      expect(mockFind).toHaveBeenCalledTimes(1);
    });
  })
});
