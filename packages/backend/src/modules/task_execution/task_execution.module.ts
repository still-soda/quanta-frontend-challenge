import { Module } from '@nestjs/common';
import { TaskExecutionService } from './task_execution.service';

@Module({
  providers: [TaskExecutionService]
})
export class TaskExecutionModule {}
