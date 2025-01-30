import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SubmissionsModule } from '../submissions/submissions.module';
import { JudgementsModule } from '../judgements/judgements.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    SubmissionsModule,
    JudgementsModule,
    BullModule.registerQueue({
      name: 'tasks',
      defaultJobOptions: {
        timeout: 1000 * 30, // 30 秒
      },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
