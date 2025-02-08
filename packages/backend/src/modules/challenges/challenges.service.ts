import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import {
  CHALLENGE_STATUS,
  Challenges,
  ChallengesDocument,
} from '../../schemas/challenges.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import validateData from '../../utils/validate-data.utils';
import { UserData } from '../../common/decorators/user.decorator';
import { responseError } from '../../utils/http-response.utils';
import { isMongoId } from 'class-validator';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenges.name)
    private readonly challengeModel: Model<ChallengesDocument>,
  ) {}

  /**
   * 创建挑战
   * @private 仅供内部调用，接口请使用 `adminCreate`
   * @param createChallengeDto 创建挑战数据
   * @returns 创建的挑战数据
   */
  async create(createChallengeDto: CreateChallengeDto & { authorId: string }) {
    const createdChallenge = new this.challengeModel(createChallengeDto);
    return createdChallenge.save();
  }

  /**
   * 管理员创建挑战
   * @param user 当前用户
   * @param createChallengeDto 创建挑战数据
   * @returns 创建的挑战数据
   * @throws
   * - `bad request` 数据验证失败
   */
  async adminCreate(user: UserData, createChallengeDto: CreateChallengeDto) {
    try {
      createChallengeDto = await validateData(
        CreateChallengeDto,
        createChallengeDto,
      );
    } catch (error) {
      return responseError('bad request', { msg: error.message });
    }

    return this.create({
      ...createChallengeDto,
      authorId: user.id,
    });
  }

  /**
   * 用户查找所有挑战
   * @returns 挑战列表
   */
  async findAll() {
    return await this.challengeModel.find();
  }

  async adminFindAll() {}

  /**
   * 查找一个挑战
   * @param id 挑战ID
   * @returns 挑战数据
   */
  async findOne(id: string) {
    return await this.challengeModel.findById(id);
  }

  /**
   * 根据状态查找挑战
   * @param status 挑战状态
   * @returns 挑战列表
   */
  async findByStatus(status: CHALLENGE_STATUS) {
    return await this.challengeModel.find({ status }).exec();
  }

  /**
   * 更新挑战
   * @param id 挑战ID
   * @param updateChallengeDto 更新挑战数据
   * @returns 更新后的挑战数据
   */
  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    updateChallengeDto = await validateData(
      UpdateChallengeDto,
      updateChallengeDto,
    );
    return this.challengeModel.findByIdAndUpdate(
      { _id: id },
      updateChallengeDto,
      { new: true },
    );
  }

  /**
   * 删除挑战
   * @param id 挑战ID
   * @returns 删除结果
   */
  async remove(id: string): Promise<any> {
    return await this.challengeModel.deleteOne({ _id: id });
  }

  /**
   * 设置挑战状态为准备中
   * @param id 挑战ID
   * @returns 更新后的挑战数据
   */
  async setStatusToReady(id: string) {
    const challenge = await this.findOne(id);
    if (CHALLENGE_STATUS.READY - challenge.status !== 1) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      { _id: id },
      { status: CHALLENGE_STATUS.READY },
      { new: true },
    );
  }

  /**
   * 设置挑战状态为已发布
   * @param id 挑战ID
   * @returns 更新后的挑战数据
   */
  async setStatusToPublished(id: string) {
    const challenge = await this.findOne(id);
    if (CHALLENGE_STATUS.PUBLISHED - challenge.status !== 1) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      { _id: id },
      { status: CHALLENGE_STATUS.PUBLISHED },
      { new: true },
    );
  }

  /**
   * 设置挑战状态为关闭
   * @param id 挑战ID
   * @returns 更新后的挑战数据
   */
  async setStatusToClosed(id: string) {
    const challenge = await this.findOne(id);
    if (CHALLENGE_STATUS.CLOSED - challenge.status !== 1) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      { _id: id },
      { status: CHALLENGE_STATUS.CLOSED },
      { new: true },
    );
  }

  /**
   * 设置挑战的截图
   * @param challengeId 挑战ID
   * @param screenshotIdList 截图ID列表
   * @returns 更新后的挑战数据
   */
  async setScreenshot(challengeId: string, screenshotIdList: string[]) {
    return await this.challengeModel.findByIdAndUpdate(
      challengeId,
      { screenshots: screenshotIdList },
      { new: true },
    );
  }

  /**
   * 设置挑战的流程数据
   * @param challengeId 挑战ID
   * @param flowDataId 流程数据ID
   * @returns 更新后的挑战数据
   */
  async setFlowData(challengeId: string, flowDataId: string) {
    return await this.challengeModel.findByIdAndUpdate(
      challengeId,
      { flowdataId: flowDataId },
      { new: true },
    );
  }

  /**
   * 设置挑战的标准答案
   * @param challengeId 挑战id
   * @param standardAnswer 标准答案文件的ID
   * @returns 更新后的挑战数据
   */
  async setStandardAnswer(challengeId: string, standardAnswer: string[]) {
    if (!standardAnswer || !standardAnswer.length) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      challengeId,
      { standardAnswer },
      { new: true },
    );
  }

  /**
   * 解决挑战
   * @param challengeId 挑战id
   * @param userId 用户id
   * @returns 更新后的挑战数据
   */
  async solveChallenge(challengeId: string, userId: string) {
    const { fastestSolvers } = await this.findOne(challengeId);

    if (fastestSolvers.includes(userId) || fastestSolvers.length >= 3) {
      return null;
    }

    return this.challengeModel.findByIdAndUpdate(
      challengeId,
      { $push: { fastestSolvers: userId } },
      { new: true },
    );
  }
}
