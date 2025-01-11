import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AssetsModule } from '../assets/assets.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [AssetsModule, ChallengesModule],
  providers: [TasksService],
})
export class TasksModule {}
