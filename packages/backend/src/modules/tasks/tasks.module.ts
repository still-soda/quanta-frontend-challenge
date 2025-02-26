import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SubmissionsModule } from '../submissions/submissions.module';
import { JudgementsModule } from '../judgements/judgements.module';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from '../users/users.module';
import { ChallengesModule } from '../challenges/challenges.module';
import { CommitHeatmapModule } from '../commit-heatmap/commit-heatmap.module';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [
    SubmissionsModule,
    JudgementsModule,
    UsersModule,
    ChallengesModule,
    CommitHeatmapModule,
    ActionsModule,
    BullModule.registerQueue({
      name: 'tasks',
      defaultJobOptions: {
        timeout: Number(process.env.MAX_PROCESS_TIMEOUT ?? 30000), // 30 秒
      },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule { }
