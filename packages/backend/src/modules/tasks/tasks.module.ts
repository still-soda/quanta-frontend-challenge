import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SubmissionsModule } from '../submissions/submissions.module';
import { JudgementsModule } from '../judgements/judgements.module';

@Module({
  imports: [SubmissionsModule, JudgementsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
