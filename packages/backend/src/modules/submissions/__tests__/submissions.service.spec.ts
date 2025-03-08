import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from '../submissions.service';
import { SubmissionsModule } from '../submissions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { CommitHeatmapModule } from '../../../modules/commit-heatmap/commit-heatmap.module';
import { randomMongoId } from '../../../utils/testing.utils';
import { CounterModule } from '../../../modules/counter/counter.module';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SubmissionsModule,
        CommitHeatmapModule,
        CounterModule,
        mockDb.module,
      ],
      providers: [SubmissionsService],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  describe('create', () => {
    it('应该正确创建提交', async () => {
      const createSubmissionDto: any = {
        type: 'execute',
        userId: '123',
        challengeId: '456',
      };
      const submissionModelCreateSpy = jest
        .spyOn(service['submissionModel'], 'create')
        .mockImplementationOnce((async () => ({})) as any);
      const increaseHeatmapCountSpy = jest
        .spyOn(service['commitHeatmapService'], 'increaseHeatmapCount')
        .mockImplementationOnce((async () => ({})) as any);
      const nextValueSpy = jest
        .spyOn(service['counterService'], 'nextValue')
        .mockImplementationOnce((async () => 1) as any);

      const res = await service.create(createSubmissionDto);
      expect(res).toBeDefined();
      expect(submissionModelCreateSpy).toHaveBeenCalledTimes(1);
      expect(increaseHeatmapCountSpy).toHaveBeenCalledTimes(1);
      expect(nextValueSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('应该正确查找提交', async () => {
      const submissionModelFindByIdSpy = jest
        .spyOn(service['submissionModel'], 'findById')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await service.findOne('123');
      expect(res).toBeDefined();
      expect(submissionModelFindByIdSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUserId', () => {
    it('应该正确查找用户的提交', async () => {
      const submissionModelFindSpy = jest
        .spyOn(service['submissionModel'], 'find')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await service.findAllByUserId(randomMongoId());
      expect(res).toBeDefined();
      expect(submissionModelFindSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('应该正确更新提交', async () => {
      const submissionModelFindByIdAndUpdateSpy = jest
        .spyOn(service['submissionModel'], 'findByIdAndUpdate')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await service.update(randomMongoId(), { status: 'passed' });
      expect(res).toBeDefined();
      expect(submissionModelFindByIdAndUpdateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('应该正确删除提交', async () => {
      const id = randomMongoId();

      const submissionModelFindByIdSpy = jest
        .spyOn(service['submissionModel'], 'findById')
        .mockImplementationOnce((async () => ({ userId: id })) as any);
      submissionModelFindByIdSpy.mockClear();

      const submissionModelFindByIdAndDeleteSpy = jest
        .spyOn(service['submissionModel'], 'findByIdAndDelete')
        .mockImplementationOnce((async () => ({})) as any);

      const res = await service.remove(id, id);
      expect(res).toBeDefined();
      expect(submissionModelFindByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
      expect(submissionModelFindByIdSpy).toHaveBeenCalledTimes(1);
    });
  });
});
