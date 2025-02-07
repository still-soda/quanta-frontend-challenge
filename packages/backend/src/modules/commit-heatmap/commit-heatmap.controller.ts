import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CommitHeatmapService } from './commit-heatmap.service';
import { ApiNeedAuth, Auth } from '../../common/decorators/auth.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';

@Controller('commit-heatmap')
export class CommitHeatmapController {
  constructor(private readonly commitHeatmapService: CommitHeatmapService) {}

  @ApiOperation({ summary: '获取用户的提交热力图数据' })
  @ApiNeedAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取用户的提交热力图数据',
    schema: responseSchema('ok', '成功获取[${username}]的提交热力图数据', {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string', example: '2021-01-01' },
          count: { type: 'number', example: 123 },
          userId: { type: 'string', example: '123' },
        },
      },
    }),
  })
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
