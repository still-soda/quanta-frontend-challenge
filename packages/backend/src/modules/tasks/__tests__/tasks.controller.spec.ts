import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JudgementsModule } from '../../../modules/judgements/judgements.module';
import { JudgementsService } from '../../../modules/judgements/judgements.service';
import { SubmissionsModule } from '../../../modules/submissions/submissions.module';
import { SubmissionsService } from '../../../modules/submissions/submissions.service';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { ActionsModule } from '../../../modules/actions/actions.module';
import { TasksProcessor } from '../tasks.processor';
import { TasksModule } from '../tasks.module';

describe('TasksController', () => {
  let controller: TasksController;
  let processor: TasksProcessor;
  let mongodb: MongoMemoryServer;
  let module: TestingModule;
  let judgementsService: JudgementsService;
  let submissionService: SubmissionsService;

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
        ActionsModule
      ],
      controllers: [TasksController],
    }).compile();
    module.useLogger(console);
    await module.init();

    judgementsService = module.get<JudgementsService>(JudgementsService);
    submissionService = module.get<SubmissionsService>(SubmissionsService);
    controller = module.get<TasksController>(TasksController);
    processor = new TasksProcessor(judgementsService, submissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
