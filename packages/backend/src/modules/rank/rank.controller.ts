import { Controller, Get, Post, Query } from '@nestjs/common';
import { RankService } from './rank.service';
import { Auth, ROLE } from '../../common/decorators/auth.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { responseSuccess } from '../../utils/http-response.utils';
import { UseCache } from '../../common/decorators/cache.decorator';
import { RankDoc } from './rank.doc';

@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  /**
   * 获取最近一次更新的全体排名
   * @returns 最近一次更新的全体排名
   */
  @RankDoc.forRoute('/recent-rank')
  @Get('/recent-rank')
  @UseCache()
  async findRecent() {
    const recent = await this.rankService.findRecent();
    return responseSuccess('ok', recent, '成功获取');
  }

  /**
   * 获取我的排名历史
   * @returns 我的排名历史
   */
  @RankDoc.forRoute('/my-history')
  @Get('/my-history')
  @UseCache()
  @Auth()
  async findMyHistory(@CurrentUser() user: UserData) {
    const history = await this.rankService.findSomeonesHistory(user.id);
    return responseSuccess('ok', history, '成功获取');
  }

  /**
   * 获取某个用户的排名历史
   * @param userId 用户ID
   * @returns 某个用户的排名历史
   */
  @RankDoc.forRoute('/someones-history')
  @Get('/someones-history')
  @Auth(ROLE.ADMIN)
  async findSomeonesHistory(@Query('userId') userId: string) {
    const history = await this.rankService.findSomeonesHistory(userId);
    return responseSuccess('ok', history, '成功获取');
  }

  /**
   * 强制更新排名
   * @returns 更新后的排行榜数据
   * @throws
   * - `internal server error` 排行榜数据插入失败 / 更新排行榜时间失败
   */
  @RankDoc.forRoute('/force-update')
  @Post('/force-update')
  @Auth(ROLE.SUPER_ADMIN)
  async forceUpdate() {
    const newRank = await this.rankService.forceUpdateRank();
    return responseSuccess('ok', newRank, '成功更新排名');
  }

  /**
   * 获取某个时间点的全体排名
   * @param time 时间点，是一个可以被 `Date.parse` 解析的字符串
   * @returns 某个时间点的全体排名
   */
  @RankDoc.forRoute('/history-sometime')
  @Get('/history-sometime')
  @Auth(ROLE.ADMIN)
  async findHistorySometime(@Query('time') time: string) {
    const history = await this.rankService.findHistorySometime(time);
    return responseSuccess('ok', history, '成功获取');
  }
}
