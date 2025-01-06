import { Test, TestingModule } from '@nestjs/testing';
import { TaskExecutionService } from './task-execution.service';

describe('TaskExecutionService', () => {
  let service: TaskExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskExecutionService],
    }).compile();

    service = module.get<TaskExecutionService>(TaskExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
