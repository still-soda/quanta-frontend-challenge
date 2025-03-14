import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Submissions,
  SubmissionsDocument,
  SubmissionStatus,
  SubmissionType,
} from '../../schemas/submissions.schema';
import { DeleteResult, Model } from 'mongoose';
import validateData from '../../utils/validate-data.utils';
import { CommitHeatmapService } from '../commit-heatmap/commit-heatmap.service';
import { responseError } from '../../utils/http-response.utils';
import { isMongoId } from 'class-validator';
import { UserData } from '../../common/decorators/user.decorator';
import { ROLE } from '../../common/decorators/auth.decorator';
import { CounterService } from '../counter/counter.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submissions.name)
    private readonly submissionModel: Model<SubmissionsDocument>,
    private readonly commitHeatmapService: CommitHeatmapService,
    private readonly counterService: CounterService,
  ) {}

  /**
   * 内部函数，查找指定ID的提交
   * @private
   * @param id 提交ID
   * @returns 查找结果
   */
  async findOne(id: string) {
    return await this.submissionModel.findById(id);
  }

  /**
   * 查找指定ID的提交
   * @param id 提交ID
   * @param user 当前用户
   * @returns 查找结果
   * @throws
   * - `not found`: 提交记录不存在
   * - `forbidden`: 非管理员无权查看他人提交记录
   */
  async fineOneSubmission(id: string, user: UserData) {
    const submission = await this.submissionModel.findById(id);
    if (!submission) {
      throw responseError('not found', { msg: '提交记录不存在' });
    }

    const { id: userId, role } = user;

    if (submission.userId !== userId && role < ROLE.ADMIN) {
      throw responseError('forbidden', { msg: '非管理员无权查看他人提交记录' });
    }

    return submission;
  }

  /**
   * 创建提交
   * @param createSubmissionDto
   * - `type`: 提交类型
   * - `userId`: 用户ID
   * - `challengeId`: 挑战ID
   * @returns 创建的提交
   * @throws
   * - `bad request`: 请求数据错误
   */
  async create(createSubmissionDto: CreateSubmissionDto) {
    try {
      createSubmissionDto = await validateData(
        CreateSubmissionDto,
        createSubmissionDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    if (createSubmissionDto.type === 'execute') {
      await this.commitHeatmapService.increaseHeatmapCount({
        date: new Date().toISOString(),
        userId: createSubmissionDto.userId,
      });
    }

    const order = await this.counterService.nextValue(Submissions.name);

    return await this.submissionModel.create({ ...createSubmissionDto, order });
  }

  /**
   * 根据用户ID查找所有提交
   * @param userId 用户ID
   * @returns 所有提交
   * @throws
   * - `bad request`: 用户ID不合法
   */
  async findAllByUserId(userId: string) {
    if (!isMongoId(userId)) {
      throw responseError('bad request', { msg: '用户ID不合法' });
    }

    return await this.submissionModel.find({ userId });
  }

  /**
   * 根据挑战ID查找所有提交
   * @param challengeId 挑战ID
   * @param filterOptions 过滤选项
   * - `type`: 提交类型
   * - `status`: 提交状态
   * @returns 所有提交
   */
  async getSubmissionCountOfChallenge(
    challengeId: string,
    filterOptions?: {
      type?: SubmissionType;
      status?: SubmissionStatus;
    },
  ) {
    return await this.submissionModel.countDocuments({
      challengeId,
      ...(filterOptions || {}),
    });
  }

  /**
   * 获取某个挑战的通过率
   * @param challengeId 挑战ID
   * @returns 通过率
   */
  async getPassedRateByChallengeId(challengeId: string): Promise<{
    total: number;
    passed: number;
    rate: number;
  }> {
    const result = await this.submissionModel.aggregate([
      {
        // 统计通过和总数
        $facet: {
          passed: [
            { $match: { challengeId, status: 'passed' } },
            { $count: 'count' },
          ],
          total: [{ $match: { challengeId } }, { $count: 'count' }],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ['$total.count', 0] },
          passed: { $arrayElemAt: ['$passed.count', 0] },
          rate: {
            // 计算通过率，避免除数为 0
            $cond: [
              { $eq: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
              0,
              {
                $divide: [
                  { $arrayElemAt: ['$passed.count', 0] },
                  { $arrayElemAt: ['$total.count', 0] },
                ],
              },
            ],
          },
        },
      },
    ]);
    return result.length === 0 ? { total: 0, passed: 0, rate: 0 } : result[0];
  }

  /**
   * 获取某个挑战的提交记录
   * @param challengeId 挑战ID
   * @returns 提交记录
   */
  async getSubmissionOfChallenge(
    challengeId: string,
    filterOptions?: {
      type?: SubmissionType;
      status?: SubmissionStatus;
    },
  ) {
    return await this.submissionModel.find({
      challengeId,
      ...(filterOptions || {}),
    });
  }

  /**
   * 获取某个挑战的最大通过率
   * @param challengeId 挑战ID
   * @returns 通过率
   */
  async getMaxCorrectRateOfChallenge(challengeId: string) {
    const result = await this.submissionModel.aggregate([
      { $match: { challengeId, status: 'passed' } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    return result.length === 0 ? 0 : result[0].count;
  }

  /**
   * 更新指定ID的提交
   * @param id 提交ID
   * @param updateSubmissionDto 更新提交数据
   * - `type`: 提交类型
   * - `userId`: 用户ID
   * - `challengeId`: 挑战ID
   * @returns 更新结果
   * @throws
   * - `bad request`: 请求数据错误
   */
  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    try {
      updateSubmissionDto = await validateData(
        UpdateSubmissionDto,
        updateSubmissionDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    return this.submissionModel.findByIdAndUpdate(id, updateSubmissionDto);
  }

  /**
   * 删除指定ID的提交
   * @param id 提交ID
   * @param userId 用户ID
   * @returns 删除结果
   * @throws
   * - `not found`: 提交记录不存在
   * - `forbidden`: 无权删除他人提交记录
   */
  async remove(id: string, userId: string): Promise<DeleteResult> {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw responseError('not found', { msg: '提交记录不存在' });
    }

    if (submission.userId !== userId) {
      throw responseError('forbidden', { msg: '无权删除他人提交记录' });
    }

    return await this.submissionModel.findByIdAndDelete(id);
  }

  /**
   * 获取某个用户在某个挑战中的最高分
   * @private 仅供内部使用
   * @param challengeId 挑战ID
   * @param userId 用户ID
   * @param excludeId 排除的提交ID
   * @returns 最高分
   */
  async getMaxSubmissionScore(
    challengeId: string,
    userId: string,
    excludeId?: string,
  ) {
    const submissionWithMaxScore = await this.submissionModel
      .find({ challengeId, userId, status: 'passed', _id: { $ne: excludeId } })
      .sort({ score: -1 })
      .limit(1);
    return submissionWithMaxScore.length === 0
      ? 0
      : submissionWithMaxScore[0].score;
  }

  /**
   * 获取某个用户在某个挑战中的最新提交
   * @param challengeId 挑战ID
   * @param userId 用户ID
   * @returns 最新提交
   */
  async getMySubmissionsInChallenge(challengeId: string, userId: string) {
    return await this.submissionModel.find({ challengeId, userId });
  }
}
