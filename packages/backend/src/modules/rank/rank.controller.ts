import { Controller, Get, Post, Query } from '@nestjs/common';
import { RankService } from './rank.service';
import { ApiNeedAuth, Auth, ROLE } from '../../common/decorators/auth.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { responseSchema, responseSuccess } from '../../utils/http-response.utils';
import { UseCache } from '../../common/decorators/cache.decorator';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getRankDtoProps } from './dto/get-rank.dto';

@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) { }

  /**
   * 获取最近一次更新的全体排名
   * @returns 最近一次更新的全体排名
   */
  @ApiOperation({ summary: '获取最近一次更新的全体排名' })
  @ApiResponse({
    status: 200,
    description: '成功获取',
    schema: responseSchema('ok', '成功获取', {
      type: 'array',
      items: { type: 'object', properties: getRankDtoProps }
    })
  })
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
  @ApiOperation({ summary: '获取我的排名历史' })
  @ApiNeedAuth()
  @ApiResponse({
    status: 200,
    description: '成功获取',
    schema: responseSchema('ok', '成功获取', {
      type: 'array',
      items: { type: 'object', properties: getRankDtoProps }
    })
  })
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
  @ApiOperation({ summary: '获取某个用户的排名历史' })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiQuery({ name: 'userId', type: 'string', description: '用户ID' })
  @ApiResponse({
    status: 200,
    description: '成功获取',
    schema: responseSchema('ok', '成功获取', {
      type: 'array',
      items: { type: 'object', properties: getRankDtoProps }
    })
  })
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
  @ApiOperation({ summary: '强制更新排名' })
  @ApiNeedAuth({ level: ROLE.SUPER_ADMIN })
  @ApiResponse({
    status: 200,
    description: '成功更新排名',
    schema: responseSchema('ok', '成功更新排名', {
      type: 'array',
      items: { type: 'object', properties: getRankDtoProps }
    })
  })
  @ApiResponse({
    status: 500,
    description: '排行榜数据插入失败 / 更新排行榜时间失败',
    schema: responseSchema('internal server error', '排行榜数据插入失败 / 更新排行榜时间失败')
  })
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
  @ApiOperation({ summary: '获取某个时间点的全体排名' })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiQuery({
    name: 'time',
    description: '时间点，是一个可以被 `Date.parse` 解析的字符串'
  })
  @ApiResponse({
    status: 200,
    description: '成功获取',
    schema: responseSchema('ok', '成功获取', {
      type: 'array',
      items: { type: 'object', properties: getRankDtoProps }
    })
  })
  @Get('/history-sometime')
  @Auth(ROLE.ADMIN)
  async findHistorySometime(@Query('time') time: string) {
    const history = await this.rankService.findHistorySometime(time);
    return responseSuccess('ok', history, '成功获取');
  }
}
