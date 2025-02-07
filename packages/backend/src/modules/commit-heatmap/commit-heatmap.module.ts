import { Module } from '@nestjs/common';
import { CommitHeatmapService } from './commit-heatmap.service';
import { CommitHeatmapController } from './commit-heatmap.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommitHeatmap,
  CommitHeatmapSchema,
} from '../../schemas/commit-heatmap.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommitHeatmap.name, schema: CommitHeatmapSchema },
    ]),
  ],
  controllers: [CommitHeatmapController],
  providers: [CommitHeatmapService],
  exports: [CommitHeatmapService, MongooseModule],
})
export class CommitHeatmapModule {}
