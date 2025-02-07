import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Submissions,
  SubmissionsSchema,
} from '../../schemas/submissions.schema';
import { CommitHeatmapModule } from '../commit-heatmap/commit-heatmap.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submissions.name, schema: SubmissionsSchema },
    ]),
    CommitHeatmapModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [MongooseModule, SubmissionsService],
})
export class SubmissionsModule {}
