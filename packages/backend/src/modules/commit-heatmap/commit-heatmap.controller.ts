import { Controller, Get } from '@nestjs/common';
import { CommitHeatmapService } from './commit-heatmap.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { responseSuccess } from '../../utils/http-response.utils';
import { CommitHeatmapDoc } from './commit-heatmap.doc';

@Controller('commit-heatmap')
export class CommitHeatmapController {
  constructor(private readonly commitHeatmapService: CommitHeatmapService) {}

  @CommitHeatmapDoc.forRoute('/get-heatmap')
  @Auth()
  @Get('get-heatmap')
  async getHeatmap(@CurrentUser() user: UserData) {
    const { id, username } = user;
    const result = await this.commitHeatmapService.findHeatmapByUserId(id);
    return responseSuccess(
      'ok',
      result,
      `成功获取[${username}]的提交热力图数据`,
    );
  }
}
