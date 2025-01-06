import { Module } from '@nestjs/common';
import { TaskExecutionService } from './task-execution.service';

@Module({
  providers: [TaskExecutionService],
})
export class TaskExecutionModule {}
