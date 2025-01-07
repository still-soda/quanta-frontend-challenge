import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [AssetsModule],
  providers: [TasksService],
})
export class TasksModule {}
