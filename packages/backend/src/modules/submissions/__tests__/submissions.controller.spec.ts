import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsController } from '../submissions.controller';
import { SubmissionsService } from '../submissions.service';
import { SubmissionsModule } from '../submissions.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { CommitHeatmapModule } from '../../../modules/commit-heatmap/commit-heatmap.module';
import mongoose from 'mongoose';
import { ROLE } from '../../../common/decorators/auth.decorator';

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
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMySubmissions', () => {
    it('应该返回我的提交', async () => {
      const findAllByUserIdSpy = jest
        .spyOn(controller['submissionsService'], 'findAllByUserId')
        .mockImplementationOnce(async () => [{ id: '1' } as any]);

      const result = await controller.findMySubmissions({
        id: '1',
        username: 'test',
        role: ROLE.USER,
      });
      expect(result).toBeDefined();
      expect(result.data).toEqual([{ id: '1' }]);
      expect(findAllByUserIdSpy).toHaveBeenCalledTimes(1);

      findAllByUserIdSpy.mockRestore();
    });
  });

  describe('findMySubmissionById', () => {
    it('应该返回我的某个提交', async () => {
      const findOneByIdSpy = jest
        .spyOn(controller['submissionsService'], 'fineOneSubmission')
        .mockImplementationOnce(async () => ({ id: '1' }) as any);

      const result = await controller.findMySubmissionById(
        {
          id: '1',
          username: 'test',
          role: ROLE.USER,
        },
        '1',
      );
      expect(result).toBeDefined();
      expect(result.data).toEqual({ id: '1' });
      expect(findOneByIdSpy).toHaveBeenCalledTimes(1);

      findOneByIdSpy.mockRestore();
    });
  });

  describe('findSomeonesSubmissions', () => {
    it('应该返回某人的提交', async () => {
      const findAllByUserIdSpy = jest
        .spyOn(controller['submissionsService'], 'findAllByUserId')
        .mockImplementationOnce(async () => [{ id: '1' } as any]);

      const result = await controller.findSomeonesSubmissions('1');
      expect(result).toBeDefined();
      expect(result.data).toEqual([{ id: '1' }]);
      expect(findAllByUserIdSpy).toHaveBeenCalledTimes(1);

      findAllByUserIdSpy.mockRestore();
    });
  });

  describe('getSubmissionCountByChallengeId', () => {
    it('应该返回挑战的提交数量', async () => {
      const getSubmissionCountOfChallengeSpy = jest
        .spyOn(
          controller['submissionsService'],
          'getSubmissionCountOfChallenge',
        )
        .mockImplementationOnce(async () => 1);

      const result = await controller.getSubmissionCountByChallengeId('1');
      expect(result).toBeDefined();
      expect(result.data).toEqual({ count: 1 });
      expect(getSubmissionCountOfChallengeSpy).toHaveBeenCalledTimes(1);

      getSubmissionCountOfChallengeSpy.mockRestore();
    });
  });

  describe('getPassedRateByChallengeId', () => {
    it('应该返回挑战的通过率', async () => {
      const getPassedRateOfChallengeSpy = jest
        .spyOn(
          controller['submissionsService'],
          'getSubmissionCountOfChallenge',
        )
        .mockImplementation(async (_, { status }) => {
          return status === 'passed' ? 1 : 2;
        });

      const result = await controller.getPassedRateByChallengeId('1');
      expect(result).toBeDefined();
      expect(result.data).toEqual({ rate: 0.5 });
      expect(getPassedRateOfChallengeSpy).toHaveBeenCalledTimes(2);

      getPassedRateOfChallengeSpy.mockRestore();
    });
  });

  describe('getSubmissionRecordsByChallengeId', () => {
    it('应该返回挑战的提交记录', async () => {
      const getSubmissionRecordsSpy = jest
        .spyOn(controller['submissionsService'], 'getSubmissionOfChallenge')
        .mockImplementationOnce(async () => [{ id: '1' } as any]);

      const result = await controller.getSubmissionRecordsByChallengeId('1');
      expect(result).toBeDefined();
      expect(result.data).toEqual([{ id: '1' }]);
      expect(getSubmissionRecordsSpy).toHaveBeenCalledTimes(1);

      getSubmissionRecordsSpy.mockRestore();
    });
  });
});
