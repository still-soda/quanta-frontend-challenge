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
import { AssetsService, MulterFile } from '../assets/assets.service';
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

    return await this.assetsService.readTextFileById(challenge.contentId);
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
   * 设置挑战状态
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
   * 上传挑战标准答案（覆盖性上传）
   * @todo 上传多个标准答案文件
   * @param options 上传标准答案数据
   * - `challengeId` 挑战ID
   * - `standardAnswer` 标准答案内容
   * - `user` 当前用户
   * @returns 更新后的挑战数据
   * @throws
   * - `not found` 挑战不存在
   * - `forbidden` 非超级管理员不能代替作者上传截图
   * - `internal server error` 上传标准答案失败
   */
  async uploadStandardAnswer(options: {
    challengeId: string;
    standardAnswer: string;
    user: UserData;
  }) {
    const { challengeId, standardAnswer, user } = options;
    const challenge = await this.findOne(challengeId);

    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    if (challenge.authorId !== user.id && user.role < ROLE.SUPER_ADMIN) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替作者上传标准答案',
      });
    }

    const { ok, id } = await this.assetsService.saveTextFile({
      content: standardAnswer,
      mimeType: 'text/html',
      name: `std-ans-${challengeId}.html`,
    });

    if (!ok) {
      throw responseError('internal server error', {
        msg: '上传标准答案失败',
        withoutStack: false,
      });
    }

    return this.setStandardAnswer(challengeId, [id]);
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

  /**
   * 上传用户作答模板
   *
   * 通过验证后会将所有文件保存为静态文件，然后返回记录文件ID数组
   *
   * @param options 上传用户作答模板数据
   * - `challengeId` 挑战ID
   * - `answerTemplates` 用户作答模板文件列表
   * - `user` 当前用户
   * @returns 更新后的挑战数据
   * @throws
   * - `not found` 挑战不存在
   * - `forbidden` 非超级管理员不能代替作者上传用户作答模板
   * - `internal server error` 上传用户作答模板失败
   */
  async uploadAnswerTemplate(options: {
    challengeId: string;
    answerTemplates: MulterFile[];
    user: UserData;
  }) {
    const { challengeId, answerTemplates, user } = options;
    const challenge = await this.findOne(challengeId);

    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    if (challenge.authorId !== user.id && user.role < ROLE.SUPER_ADMIN) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替作者上传用户作答模板',
      });
    }

    const promises = answerTemplates.map(
      async (file) =>
        new Promise<string>(async (resolve, reject) => {
          const { ok, id } = await this.assetsService.saveFileAsStatic({
            file: file.buffer,
            mimeType: file.mimetype as any,
            name: file.originalname,
          });

          ok
            ? resolve(id)
            : reject(
                responseError('internal server error', {
                  msg: '上传用户作答模板失败',
                  withoutStack: false,
                }),
              );
        }),
    );

    const answerTemplateIds = await Promise.all(promises).catch((error) => {
      throw error;
    });

    return await this.challengeModel.findByIdAndUpdate(
      challengeId,
      { answerTemplate: answerTemplateIds },
      { new: true },
    );
  }

  /**
   * 获取用户作答模板的URL
   * @param answerTemplateId 用户作答模板ID
   * @returns 用户作答模板的URL
   * @throws
   * - `not found` 挑战不存在
   * - `internal server error` 获取用户作答模板URL失败
   */
  async getAnswerTemplateUrl(challengeId: string) {
    const challenge = await this.findOne(challengeId);
    if (!challenge) {
      throw responseError('not found', { msg: '挑战不存在' });
    }

    const promises = challenge.answerTemplate.map(async (id) =>
      this.assetsService.resolveStaticFilePath(id),
    );
    const urls = await Promise.all(promises).catch((error) => {
      throw responseError('internal server error', {
        msg: '获取用户作答模板URL失败',
        withoutStack: false,
      });
    });

    return urls;
  }

  /**
   * 获取发布的最新的挑战
   * @param count 获取数量
   * @returns 最新的挑战
   */
  async getLatestChallenges(count: number) {
    return await this.challengeModel
      .find({ status: CHALLENGE_STATUS.PUBLISHED })
      .sort({ createdAt: -1 })
      .limit(count);
  }

  /**
   * 上传用户作答
   *
   * 通过验证后会将所有文件保存为静态文件，然后返回记录文件ID数组
   *
   * @param answer 用户作答文件列表
   * @returns 更新后的挑战数据
   * @throws
   * - `internal server error` 上传用户作答失败
   */
  async uploadAnswer(answer: MulterFile[]) {
    const promises = answer.map(
      async (file) =>
        new Promise<string>(async (resolve, reject) => {
          const { ok, id } = await this.assetsService.saveFile({
            file: file.buffer,
            mimeType: file.mimetype as any,
            name: file.originalname,
          });

          ok
            ? resolve(id)
            : reject(
                responseError('internal server error', {
                  msg: '上传用户作答失败',
                  withoutStack: false,
                }),
              );
        }),
    );

    const answerIds = await Promise.all(promises).catch((error) => {
      throw error;
    });

    return answerIds;
  }

  /**
   * 根据ID查找挑战
   * @param id 挑战ID
   * @param options 查找挑战数据选项
   * - `onlyPublished` 只查找发布的
   * - `user` 用户过滤
   * @returns 挑战数据
   * @throws
   * - `bad request` ID 无效
   */
  async findById(
    id: string,
    options: {
      onlyPublished?: boolean;
      user?: UserData;
    } = {},
  ) {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID 无效' });
    }

    const challenge = await this.challengeModel.findById(id);
    const { onlyPublished, user } = options;

    if (onlyPublished && challenge.status !== CHALLENGE_STATUS.PUBLISHED) {
      return null;
    }

    if (
      challenge.status !== CHALLENGE_STATUS.PUBLISHED &&
      user &&
      user.role < ROLE.SUPER_ADMIN &&
      challenge.authorId !== user.id
    ) {
      return null;
    }

    return challenge;
  }
}
