import { Injectable } from '@nestjs/common';
import { CreateResolvedChallengeDto } from './dto/create-resolved-challenge.dto';
import validateData from '../../utils/validate-data.utils';
import { responseError } from '../../utils/http-response.utils';
import { CounterService } from '../counter/counter.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResolvedChallenge,
  ResolvedChallengeDocument,
} from '../../schemas/resolved-challenge.schema';
import { Model } from 'mongoose';

@Injectable()
export class ResolvedChallengeService {
  constructor(
    @InjectModel(ResolvedChallenge.name)
    private readonly resolvedChallengeModel: Model<ResolvedChallengeDocument>,
    private readonly counterService: CounterService,
  ) {}

  /**
   * 创建一个解决挑战记录
   * @param createResolvedChallengeDto 挑战记录数据
   * @returns 创建的挑战记录
   * @throws
   * - `bad request`: 数据验证失败
   */
  async create(createResolvedChallengeDto: CreateResolvedChallengeDto) {
    try {
      createResolvedChallengeDto = await validateData(
        CreateResolvedChallengeDto,
        createResolvedChallengeDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const couterId = `challenge:${createResolvedChallengeDto.challengeId}`;
    const rank = await this.counterService.nextValue(couterId);

    return await this.resolvedChallengeModel.create({
      ...createResolvedChallengeDto,
      rank,
    });
  }

  /**
   * 获取挑战的前三名解决记录
   * @param challengeId 挑战 ID
   * @returns 前三名解决记录
   */
  async getEarliestThreeResolvedChallenges(challengeId: string) {
    return await this.resolvedChallengeModel
      .find({ challengeId })
      .sort({ rank: 1 })
      .limit(3);
  }

  /**
   * 获取用户解决记录中是前三名的记录
   * @param userId 用户 ID
   * @returns 用户解决记录中是前三名的记录
   */
  async getUserEarliestResolvedChallenge(userId: string) {
    return await this.resolvedChallengeModel.find({
      userId,
      rank: { $lte: 3 },
    });
  }

  /**
   * 获取挑战的解决记录
   * @param options 参数
   * - `challengeId` 挑战 ID
   * - `limit` 每页数量
   * - `page` 页码
   * @returns 解决记录
   * - `totalPage` 总页数
   * - `currentPage` 当前页码
   * - `isLastPage` 是否是最后一页
   * - `isFirstPage` 是否是第一页
   * - `data` 查询结果
   */
  async getResolvedChallengeByChallengeId(options: {
    challengeId: string;
    limit: number;
    page: number;
  }) {
    const { challengeId, limit, page } = options;
    const total = await this.resolvedChallengeModel.countDocuments({
      challengeId,
    });

    const data = await this.resolvedChallengeModel
      .find({ challengeId })
      .sort({ rank: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      totalPage: Math.ceil(total / limit),
      currentPage: page,
      isLastPage: page * limit >= total,
      isFistPage: page <= 1,
      data,
    };
  }

  /**
   * 获取用户解决记录
   * @param options 参数
   * - `userId` 用户 ID
   * - `limit` 每页数量
   * - `page` 页码
   * @returns 解决记录
   * - `totalPage` 总页数
   * - `currentPage` 当前页码
   * - `isLastPage` 是否是最后一页
   * - `isFirstPage` 是否是第一页
   * - `data` 查询结果
   */
  async getResolvedChallengeByUserId(options: {
    userId: string;
    limit: number;
    page: number;
  }) {
    const { userId, limit, page } = options;
    const total = await this.resolvedChallengeModel.countDocuments({ userId });

    const data = await this.resolvedChallengeModel
      .find({ userId })
      .sort({ rank: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      totalPage: Math.ceil(total / limit),
      currentPage: page,
      isLastPage: page * limit >= total,
      isFistPage: page <= 1,
      data,
    };
  }
}
