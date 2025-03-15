import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JudgementsModule } from '../../../modules/judgements/judgements.module';
import { SubmissionsModule } from '../../../modules/submissions/submissions.module';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { ActionsModule } from '../../../modules/actions/actions.module';
import { TasksModule } from '../tasks.module';
import { ROLE } from '../../../common/decorators/auth.decorator';
import mongoose from 'mongoose';
import { CounterModule } from '../../../modules/counter/counter.module';
import { CachesModule } from '../../../modules/caches/caches.module';
import { Subject } from 'rxjs';
import { ResolvedChallengeModule } from '../../../modules/resolved-challenge/resolved-challenge.module';

describe('TasksController', () => {
  let controller: TasksController;
  let mongodb: MongoMemoryServer;
  let module: TestingModule;

  const id = '6756f5605fe86d4166703162';

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    module = await Test.createTestingModule({
      imports: [
        JudgementsModule,
        SubmissionsModule,
        CounterModule,
        CachesModule,
        ResolvedChallengeModule,
        createEnvConfModule('.env.development'),
        mockDb.module,
        TasksModule,
        ActionsModule,
      ],
      controllers: [TasksController],
    }).compile();
    module.useLogger(console);
    await module.init();

    controller = module.get<TasksController>(TasksController);
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
    const body = { challengeId: '1', data: '{}' };
    const res = await controller.uploadFlowData(user, body);
    expect(res).toHaveProperty('code', 200);
    expect(uploadFlowDataSpy).toHaveBeenCalledTimes(1);
  });

  it('应该正确调用 service 的 launchPreExecute', async () => {
    const service = controller['tasksService'];
    const launchPreExecuteSpy = jest
      .spyOn(service, 'pushPreExecuteJob')
      .mockImplementationOnce(async () => {
        return {
          id: 123,
          data: {
            submissionId: '123',
          },
        } as any;
      });
    const user = { id, username: 'test', role: ROLE.USER };
    const body = { challengeId: '1' };
    const res = await controller.launchPreExecute(user, body);
    expect(res).toHaveProperty('data.jobId', '123');
    expect(res).toHaveProperty('data.submissionId', '123');
    expect(launchPreExecuteSpy).toHaveBeenCalledTimes(1);
  });

  it('应该正确调用 service 的 launchExecute', async () => {
    const service = controller['tasksService'];
    const launchExecuteSpy = jest
      .spyOn(service, 'pushExecuteJob')
      .mockImplementationOnce(async () => {
        return {
          id: 123,
          data: {
            submissionId: '123',
          },
        } as any;
      });
    const user = { id, username: 'test', role: ROLE.USER };
    const body = { challengeId: '1', submitFileId: '2' };
    const res = await controller.launchExecute(user, body);
    expect(res).toHaveProperty('data.jobId', '123');
    expect(res).toHaveProperty('data.submissionId', '123');
    expect(launchExecuteSpy).toHaveBeenCalledTimes(1);
  });

  it('应该正确获取指定提交记录前排队的 Observable 对象', async () => {
    const $subject = new Subject<number>();
    const spyGetPrevTaskCountSubject = jest
      .spyOn(controller['tasksService'], 'getPrevTaskCountSubject')
      .mockImplementationOnce(async () => $subject);

    const user = { id, username: 'test', role: ROLE.USER };
    const submissionId = '123';
    const res = await controller.subscribePrevTaskCount(submissionId, user);

    let data = '';
    res.subscribe((val) => (data = val.data as string));

    $subject.next(1);
    expect(data).toBe('1');
    expect(spyGetPrevTaskCountSubject).toHaveBeenCalledTimes(1);
  });
});
