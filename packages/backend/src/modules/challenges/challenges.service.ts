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
import { ROLE } from '../../common/decorators/auth.decorator';
import { AssetsService } from '../assets/assets.service';
import { ChallengeSwitchStatusDto } from './dto/switch-status.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenges.name)
    private readonly challengeModel: Model<ChallengesDocument>,
    private readonly assetsService: AssetsService,
  ) {}

  /**
   * 管理员创建挑战
   * @param user 当前用户
   * @param createChallengeDto 创建挑战数据
   * @returns 创建的挑战数据
   * @throws
   * - `bad request` 数据验证失败
   * - `internal server error` 保存内容文件失败
   */
  async create(user: UserData, createChallengeDto: CreateChallengeDto) {
    try {
      createChallengeDto = await validateData(
        CreateChallengeDto,
        createChallengeDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const saveResult = await this.assetsService.saveTextFile({
      content: createChallengeDto.content,
      name: createChallengeDto.title + '.md',
      mimeType: 'text/markdown',
    });
    if (!saveResult.ok) {
      throw responseError('internal server error', {
        msg: '保存内容文件失败',
        withoutStack: false,
      });
    }

    return await this.challengeModel.create({
      ...createChallengeDto,
      contentId: saveResult.id,
      authorId: user.id,
    });
  }

  /**
   * 用户查找所有挑战，只返回已发布的挑战
   * @returns 挑战列表
   */
  async findAll() {
    return await this.challengeModel.find({
      status: CHALLENGE_STATUS.PUBLISHED,
    });
  }

  /**
   * 管理员查找所有挑战，超级管理员可以查找所有挑战，否则只查找自己创建的挑战
   * @param user 当前用户
   * @returns 挑战列表
   */
  async adminFindAll(user: UserData) {
    if (user.role < ROLE.SUPER_ADMIN) {
      return await this.challengeModel.find({ authorId: user.id });
    }
    return await this.challengeModel.find();
  }

  /**
   * 查找一个挑战
   * @private 仅供内部调用
   * @param id 挑战ID
   * @returns 挑战数据
   */
  async findOne(id: string) {
    return await this.challengeModel.findById(id);
  }

  /**
   * 查找一个挑战的详细信息
   * @param id 挑战ID
   * @returns 挑战的详细信息
   * @throws
   * - `bad request` ID 无效
   * - `not found` 挑战不存在
   */
  async getDetail(id: string) {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID 无效' });
    }

    const challenge = await this.findOne(id);
    if (!challenge || challenge.status !== CHALLENGE_STATUS.PUBLISHED) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    return await this.assetsService.readTextFile(challenge.contentId);
  }

  /**
   * 管理员获取挑战详情。
   *
   * 需要管理员及以上的权限，超级管理员可以获取所有详情。
   *
   * @param id 挑战ID
   * @param user 当前用户
   * @returns 挑战数据
   * @throws
   * - `bad request` ID 无效
   * - `not found` 挑战不存在
   * - `forbidden` 非超级管理员不能代替别人获取挑战详情
   */
  async adminGetDetail(id: string, user: UserData) {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID 无效' });
    }

    const challenge = await this.findOne(id);

    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    if (user.role < ROLE.SUPER_ADMIN && challenge.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人获取挑战详情',
      });
    }

    return challenge;
  }

  /**
   * 更新挑战，如果内容有更新，会保存新的内容文件。
   *
   * 需要超级管理员权限，或者挑战的作者才能更新挑战。
   *
   * @param id 挑战ID
   * @param updateChallengeDto 更新挑战数据
   * @param user 当前用户
   * @returns 更新后的挑战数据
   * @throws
   * - `bad request` 数据验证失败
   * - `not found` 挑战不存在
   * - `forbidden` 非超级管理员不能代替别人更新挑战
   */
  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
    user: UserData,
  ) {
    updateChallengeDto = await validateData(
      UpdateChallengeDto,
      updateChallengeDto,
    );
    try {
      updateChallengeDto = await validateData(
        UpdateChallengeDto,
        updateChallengeDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const challenge = await this.findOne(id);
    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    if (user.role < ROLE.SUPER_ADMIN && challenge.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人更新挑战',
      });
    }

    // 保存内容文件
    if (updateChallengeDto.content) {
      const saveResult = await this.assetsService.saveTextFile({
        content: updateChallengeDto.content,
        name: challenge.title + '.md',
        mimeType: 'text/markdown',
      });
      if (!saveResult.ok) {
        throw responseError('internal server error', {
          msg: '保存内容文件失败',
          withoutStack: false,
        });
      }
      delete updateChallengeDto.content;
      (updateChallengeDto as any).contentId = saveResult.id;
    }

    return this.challengeModel.findByIdAndUpdate(id, updateChallengeDto, {
      new: true,
    });
  }

  /**
   * 删除挑战。
   *
   * 需要超级管理员权限，或者挑战的作者才能删除挑战。
   *
   * @param id 挑战ID
   * @param user 当前用户
   * @returns 删除结果
   * @throws
   * - `bad request` ID 无效
   * - `not found` 挑战不存在
   * - `forbidden` 非超级管理员不能代替别人删除挑战
   */
  async remove(id: string, user: UserData): Promise<any> {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID 无效' });
    }

    const challenge = await this.findOne(id);
    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    if (user.role < ROLE.SUPER_ADMIN && challenge.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人删除挑战',
      });
    }

    return this.challengeModel.findByIdAndDelete(id);
  }

  /**
   * 设置挑战状态。
   *
   * 需要超级管理员权限，或者挑战的作者才能设置挑战状态。
   *
   * @param dto 设置挑战状态数据
   * - `id` 挑战ID
   * - `status` 挑战状态
   * @param status 挑战状态
   * @returns 更新后的挑战数据
   * @throws
   * - `not found` 挑战不存在
   * - `forbidden` 挑战未就绪
   * - `forbidden` 非超级管理员不能代替别人更新挑战
   */
  async switchStatus(dto: ChallengeSwitchStatusDto, user: UserData) {
    try {
      dto = await validateData(ChallengeSwitchStatusDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { id, status } = dto;

    const challenge = await this.findOne(id);
    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    if (challenge.status < CHALLENGE_STATUS.READY) {
      throw responseError('forbidden', { msg: '挑战未就绪' });
    }

    if (user.role < ROLE.SUPER_ADMIN && challenge.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人更新挑战',
      });
    }

    return await this.setStatusTo(id, status);
  }

  /**
   * 设置挑战状态为准备中
   * @private 仅供内部调用
   * @param id 挑战ID
   * @returns 更新后的挑战数据
   */
  async setStatusTo(id: string, status: CHALLENGE_STATUS) {
    if (status < CHALLENGE_STATUS.READY) {
      return null;
    }

    return await this.challengeModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  /**
   * 设置挑战的截图
   * @private 仅供内部调用
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
   * @private 仅供内部调用
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
   * @private 仅供内部调用
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
   * @private 仅供内部调用
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
