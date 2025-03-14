import { Injectable } from '@nestjs/common';
import { Rank, RankDocument } from '../../schemas/rank.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import { responseError } from '../../utils/http-response.utils';
import { isMongoId } from 'class-validator';

/**
 * 分数区间数据
 * @property from 区间起始分数
 * @property to 区间结束分数，不包含
 * @property count 该区间的人数
 */
export interface ScoreInterval {
  from: number;
  to: number;
  count: number;
}

@Injectable()
export class RankService {
  private recentRankTime: Date | null = null;
  private scoreInterval: ScoreInterval[] | null = null;

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
   * 生成分数区间并保存到文件
   * @private 内部方法
   * @param orderedRank 排序后的排行榜
   * @param intervalCnt 区间个数
   */
  generateScoreInteval(orderedRank: Rank[], intervalCnt: number) {
    // 计算分数区间
    const scores = orderedRank.map((rank) => rank.score);
    const maxScore = Math.max(...scores) + 1;
    const minScore = Math.min(...scores);
    const interval = (maxScore - minScore) / intervalCnt;

    // 统计每个区间的人数
    const result: ScoreInterval[] = [];
    for (let i = 0; i < intervalCnt; i++) {
      const from = minScore + i * interval;
      const to = minScore + (i + 1) * interval;
      const count = orderedRank.filter(
        (rank) => rank.score >= from && rank.score < to,
      ).length;
      result.push({ from, to, count });
    }

    if (result.length > 0) {
      result[result.length - 1].to = maxScore; // 修正最后一个区间的 to
      result[result.length - 1].count++; // 修正最后一个区间的 count
    }

    // 保存到文件
    this.scoreInterval = result;
    fs.writeFileSync(`./.temp/score-interval.json`, JSON.stringify(result));
  }

  /**
   * 读取分数区间
   * @returns 分数区间
   */
  getScoreInterval(): ScoreInterval[] {
    if (this.scoreInterval) {
      return this.scoreInterval;
    }

    try {
      const data = fs.readFileSync('./.temp/score-interval.json', 'utf-8');
      this.scoreInterval = JSON.parse(data);
      return this.scoreInterval;
    } catch (error) {
      return [];
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

    // 生成分数区间
    this.generateScoreInteval(rankList as Rank[], 11);

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

  /**
   * 获取用户超越的百分比
   * @param userId 用户ID
   * @returns
   * - lower: 比自己分数低的人数
   * - total: 总人数
   * - percent: 超越的百分比
   * @throws
   * - `bad request` 用户ID不合法
   */
  async getOvercomingPercent(userId: string): Promise<{
    lower: number;
    total: number;
    percent: number;
  }> {
    if (!isMongoId(userId)) {
      throw responseError('bad request', { msg: '用户ID不合法' });
    }

    const recentTime = this.getRecentRankTime();
    const userRank = await this.rankModel.findOne({
      userId,
      time: recentTime,
    });

    const result = await this.rankModel.aggregate([
      {
        $facet: {
          totalCount: [{ $match: { time: recentTime } }, { $count: 'total' }],
          lowerCount: [
            // 排名比 rank 大的人数即为比自己分数低的人数
            { $match: { time: recentTime, rank: { $gt: userRank.rank } } },
            { $count: 'lower' },
          ],
        },
      },
      {
        $project: {
          lower: { $arrayElemAt: ['$lowerCount.lower', 0] },
          total: { $arrayElemAt: ['$totalCount.total', 0] },
        },
      },
      {
        $project: {
          lower: 1,
          total: 1,
          percent: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $divide: ['$lower', '$total'] },
            ],
          },
        },
      },
    ]);

    return result[0];
  }
}
