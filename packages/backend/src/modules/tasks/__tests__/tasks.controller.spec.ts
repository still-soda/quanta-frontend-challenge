import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JudgementsModule } from '../../../modules/judgements/judgements.module';
import { JudgementsService } from '../../../modules/judgements/judgements.service';
import { SubmissionsModule } from '../../../modules/submissions/submissions.module';
import { SubmissionsService } from '../../../modules/submissions/submissions.service';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { ActionsModule } from '../../../modules/actions/actions.module';
import { TasksProcessor } from '../tasks.processor';
import { TasksModule } from '../tasks.module';
import { ROLE } from '../../../common/decorators/auth.decorator';
import mongoose from 'mongoose';
import { ChallengesService } from '../../../modules/challenges/challenges.service';

describe('TasksController', () => {
  let controller: TasksController;
  let processor: TasksProcessor;
  let mongodb: MongoMemoryServer;
  let module: TestingModule;
  let judgementsService: JudgementsService;
  let submissionService: SubmissionsService;
  let challengeService: ChallengesService;

  const id = '6756f5605fe86d4166703162';

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    module = await Test.createTestingModule({
      imports: [
        JudgementsModule,
        SubmissionsModule,
        createEnvConfModule(),
        mockDb.module,
        TasksModule,
        ActionsModule,
      ],
      controllers: [TasksController],
    }).compile();
    module.useLogger(console);
    await module.init();

    judgementsService = module.get<JudgementsService>(JudgementsService);
    submissionService = module.get<SubmissionsService>(SubmissionsService);
    challengeService = module.get<ChallengesService>(ChallengesService);
    controller = module.get<TasksController>(TasksController);
    processor = new TasksProcessor(
      judgementsService,
      submissionService,
      challengeService,
    );
  });

  afterAll(async () => {
    await module.close();
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('应该正确调用 service 的 uploadFlowData 方法', async () => {
    const service = controller['tasksService'];
    const uploadFlowDataSpy = jest
      .spyOn(service, 'uploadFlowData')
      .mockImplementationOnce(async () => {
        return { id: 123 } as any;
      });
    const user = { id, username: 'test', role: ROLE.USER };
    const body = { challengeId: '1', data: {} };
    const res = await controller.uploadFlowData(user, body);
    expect(res).toHaveProperty('code', 200);
    expect(uploadFlowDataSpy).toHaveBeenCalledTimes(1);
  });

  it('应该正确调用 service 的 launchPreExecute', async () => {
    const service = controller['tasksService'];
    const launchPreExecuteSpy = jest
      .spyOn(service, 'pushPreExecuteJob')
      .mockImplementationOnce(async () => {
        return { id: 123 } as any;
      });
    const user = { id, username: 'test', role: ROLE.USER };
    const body = { challengeId: '1' };
    const res = await controller.launchPreExecute(user, body);
    expect(res).toHaveProperty('data.jobId', '123');
    expect(launchPreExecuteSpy).toHaveBeenCalledTimes(1);
  });

  it('应该正确调用 service 的 launchExecute', async () => {
    const service = controller['tasksService'];
    const launchExecuteSpy = jest
      .spyOn(service, 'pushExecuteJob')
      .mockImplementationOnce(async () => {
        return { id: 123 } as any;
      });
    const user = { id, username: 'test', role: ROLE.USER };
    const body = { challengeId: '1', submitFileId: '2' };
    const res = await controller.launchExecute(user, body);
    expect(res).toHaveProperty('data.jobId', '123');
    expect(launchExecuteSpy).toHaveBeenCalledTimes(1);
  });
});
