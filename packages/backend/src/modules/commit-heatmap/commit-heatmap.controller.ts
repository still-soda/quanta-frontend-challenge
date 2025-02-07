import { Controller } from '@nestjs/common';
import { CommitHeatmapService } from './commit-heatmap.service';

@Controller('commit-heatmap')
export class CommitHeatmapController {
  constructor(private readonly commitHeatmapService: CommitHeatmapService) {}
}
