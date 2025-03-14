import { Injectable } from '@nestjs/common';
import { Rank, RankDocument } from '../../schemas/rank.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import { responseError } from '../../utils/http-response.utils';

@Injectable()
export class RankService {
  private recentRankTime: Date | null = null;

  constructor(
    @InjectModel(Rank.name)
    private readonly rankModel: Model<RankDocument>,
    private readonly userService: UsersService,
  ) {}

  /**
   * 内部方法，获取最近一次排行榜更新时间
   * @private
   * @returns 最近一次排行榜更新时间
   * @throws
   * - `internal server error` 获取最近一次排行榜更新时间失败
   */
  getRecentRankTime() {
    if (this.recentRankTime) {
      return this.recentRankTime;
    }

    try {
      const data = fs.readFileSync('./.temp/update-info.json', 'utf-8');
      const { recentRankDate } = JSON.parse(data);
      this.recentRankTime = new Date(recentRankDate);
      return this.recentRankTime;
    } catch (error) {
      throw responseError('internal server error', {
        msg: '获取最近一次排行榜更新时间失败',
        withoutStack: false,
      });
    }
  }

  /**
   * 内部方法，更新最近一次排行榜更新时间
   * @private
   * @param time 最近更新时间
   * @throws
   * - `internal server error` 更新排行榜时间失败
   */
  updateRecentRankTime(time: Date) {
    this.recentRankTime = time;

    try {
      !fs.existsSync('./.temp') && fs.mkdirSync('./.temp');
      fs.writeFileSync(
        `./.temp/update-info.json`,
        JSON.stringify({ recentRankDate: time }),
      );
    } catch (error) {
      throw responseError('internal server error', {
        msg: '更新排行榜时间失败',
        withoutStack: false,
      });
    }
  }

  /**
   * 更新排行榜数据，每月1号凌晨定时执行，有可能被手动强制触发
   * @returns 更新后的排行榜数据
   * @throws
   * - `internal server error` 排行榜数据插入失败 / 更新排行榜时间失败
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT) // 每月1号凌晨
  async updateRank() {
    const users = await this.userService.findAll();

    // 按总分排序
    users.sort((a, b) => b.totalScore - a.totalScore);

    const rankTime = new Date();
    rankTime.setHours(0, 0, 0, 0);
    const rankList = users.map((user, index) => ({
      userId: user.id,
      score: user.totalScore,
      rank: index + 1,
      time: rankTime,
    }));

    // 开启事务，并插入排行榜数据
    const session = await this.rankModel.startSession();
    const prevRankCount = await this.rankModel.countDocuments();
    await session.withTransaction(async () => {
      await this.rankModel.insertMany(rankList, { session });
    });
    const currentRankCount = await this.rankModel.countDocuments();

    if (currentRankCount - prevRankCount !== rankList.length) {
      throw responseError('internal server error', {
        msg: '排行榜数据插入失败',
        withoutStack: false,
      });
    }

    // 更新最近一次排行榜更新时间
    this.updateRecentRankTime(rankTime);

    // 结束事务
    await session.endSession();

    return rankList;
  }

  /**
   * 获取最近一次更新的全体排名，排名按照分数从高到低排序
   * @returns 最近一次更新的全体排名
   */
  async findRecent() {
    const time = this.getRecentRankTime();
    return await this.rankModel.find({ time }).sort({ rank: 1 });
  }

  /**
   * 获取用户的排名历史，排名按照时间从早到晚排序
   * @param userId 用户ID
   * @returns 我的排名历史
   */
  async findSomeonesHistory(userId: string) {
    return await this.rankModel.find({ userId }).sort({ time: 1 });
  }

  /**
   * 获取最近一次排行榜的总人数
   * @returns 最近一次排行榜的总人数
   * @throws
   * - `bad request` 时间格式错误
   */
  async findRankCount(when: string | Date) {
    let rankTime: Date;

    if (typeof when === 'string') {
      try {
        rankTime = new Date(when);
      } catch (error) {
        throw responseError('bad request', { msg: '时间格式错误' });
      }
    } else {
      rankTime = when;
    }

    return await this.rankModel.countDocuments({ time: rankTime });
  }

  /**
   * 强制更新排名
   * @returns 更新后的排行榜数据
   * @throws
   * - `internal server error` 排行榜数据插入失败 / 更新排行榜时间失败
   */
  async forceUpdateRank() {
    return await this.updateRank();
  }

  /**
   * 获取某个时间点的全体排名
   * @param time 时间点，是一个可以被 `Date.parse` 解析的字符串
   * @returns 某个时间点的全体排名
   */
  async findHistorySometime(time: string) {
    const date = new Date(time);
    date.setHours(0, 0, 0, 0);
    return await this.rankModel.find({ time: date }).sort({ rank: 1 });
  }
}
