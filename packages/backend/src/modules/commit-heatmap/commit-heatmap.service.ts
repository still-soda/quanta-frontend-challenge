import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CommitHeatmap,
  CommitHeatmapDocument,
} from '../../schemas/commit-heatmap.schema';
import { TimeRangeQueryDto } from './dto/time-range-query.dto';
import validateData from '../../utils/validate-data.utils';
import { responseError } from '../../utils/http-response.utils';
import { FindCommitHeatmapDto } from './dto/find-commit-heatmap.dto';
import { IncreaseHeatmapCountDto } from './dto/increase-count.dto';

@Injectable()
export class CommitHeatmapService {
  constructor(
    @InjectModel(CommitHeatmap.name)
    private readonly commitHeatmapModel: Model<CommitHeatmapDocument>,
  ) {}

  /**
   * 查找用户的某一天的提交热力数据。
   * @param dto 查询参数
   * - `userId` 用户 ID
   * - `date` 日期
   * @returns 提交热力数据
   * @throws
   * - `bad request`：参数验证失败
   */
  async findOne(dto: FindCommitHeatmapDto): Promise<CommitHeatmapDocument> {
    try {
      dto = await validateData(FindCommitHeatmapDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { userId, date } = dto;
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return await this.commitHeatmapModel.findOne({ userId, date: dateObj });
  }

  /**
   * 查找用户的提交热力数据。
   * @param userId 用户 ID
   * @returns 提交热力数据
   */
  async findHeatmapByUserId(userId: string): Promise<CommitHeatmapDocument[]> {
    return await this.commitHeatmapModel.find({ userId });
  }

  /**
   * 查找用户在一段时间内的提交热力数据。
   * @param dto 查询参数
   * - `userId` 用户 ID
   * - `startDate` 开始日期
   * - `endDate` 结束日期
   * @returns 提交热力数据
   * @throws
   * - `bad request`：参数验证失败
   */
  async findHeatmapInRange(
    dto: TimeRangeQueryDto,
  ): Promise<CommitHeatmapDocument[]> {
    try {
      dto = await validateData(TimeRangeQueryDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { userId, startDate, endDate } = dto;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    return await this.commitHeatmapModel.find({
      userId,
      date: { $gte: start, $lte: end },
    });
  }

  /**
   * 增加用户的某一天的提交热力数据。
   *
   * 如果数据不存在，则创建数据；否则增加数据。
   *
   * @param dto 增加参数
   * - `userId` 用户 ID
   * - `date` 日期
   * - `count` 增加数量
   * @throws
   * - `bad request`：参数验证失败
   */
  async increaseHeatmapCount(dto: IncreaseHeatmapCountDto) {
    try {
      dto = await validateData(IncreaseHeatmapCountDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { userId, date, count } = dto;
    const dateObj = new Date(date);

    dateObj.setHours(0, 0, 0, 0);
    const exist = !!(await this.findOne({ userId, date }));
    if (!exist) {
      await this.commitHeatmapModel.create({ userId, date: dateObj, count });
      return;
    }
    await this.commitHeatmapModel.updateOne(
      { userId, date: dateObj },
      { $inc: { count } },
    );
  }
}
