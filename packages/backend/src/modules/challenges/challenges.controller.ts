import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { Auth, ROLE } from '../../common/decorators/auth.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { ChallengeSwitchStatusDto } from './dto/switch-status.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { responseSuccess } from '../../utils/http-response.utils';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { filterData } from '../../utils/filter-data.utils';
import { UserGetChallengeDto } from './dto/user-get-challenge.dto';
import { MulterFile } from '../assets/assets.service';
import { UseFileInceptor } from '../../common/decorators/file.decorator';
import { ChallengeDoc } from './challenges.doc';
import { UseCache } from '../../common/decorators/cache.decorator';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  /**
   * 用户获取所有发布的挑战。
   */
  @ChallengeDoc.forRoute('/find-all')
  @HttpCode(200)
  @UseCache()
  @Get('/find-all')
  async findAll() {
    const result = await this.challengesService.findAll();
    const filteredResult = result.map((item) =>
      filterData(UserGetChallengeDto, item),
    );
    return responseSuccess('ok', filteredResult, '获取成功');
  }

  /**
   * 管理员获取所有挑战。
   *
   * 需要管理员及以上的权限，超级管理员可以获取所有挑战。
   *
   * @param user 当前用户
   */
  @ChallengeDoc.forRoute('/admin-find-all')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Get('/admin-find-all')
  async adminFindAll(@CurrentUser() user: UserData) {
    const result = await this.challengesService.adminFindAll(user);
    const filteredResult = result.map((item) =>
      filterData(UserGetChallengeDto, item),
    );
    return responseSuccess('ok', filteredResult, '获取成功');
  }

  /**
   * 用户获取挑战详情。
   * @param id 挑战ID
   */
  @ChallengeDoc.forRoute('/detail/:id')
  @HttpCode(200)
  @UseCache()
  @Get('/detail/:id')
  async getDetail(@Param('id') id: string) {
    const content = await this.challengesService.getDetail(id);
    return responseSuccess('ok', content, '获取成功');
  }

  /**
   * 管理员获取挑战详情。
   *
   * 需要管理员及以上的权限，超级管理员可以获取所有详情。
   *
   * @param id 挑战ID
   * @param user 当前用户
   */
  @ChallengeDoc.forRoute('/admin-detail/:id')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Get('/admin-detail/:id')
  async adminGetDetail(@Param('id') id: string, @CurrentUser() user: UserData) {
    const content = await this.challengesService.adminGetDetail(id, user);
    return responseSuccess('ok', content, '获取成功');
  }

  /**
   * 创建挑战。
   * @param body 创建挑战数据
   * @param user 当前用户
   * @returns 创建的挑战数据
   */
  @ChallengeDoc.forRoute('/create')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/create')
  async create(
    @Body() body: CreateChallengeDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.challengesService.create(user, body);
    const filteredResult = filterData(UserGetChallengeDto, result);
    return responseSuccess('ok', filteredResult, '创建成功');
  }

  /**
   * 管理员删除挑战。
   *
   * 需要管理员及以上的权限，超级管理员可以删除所有挑战。
   *
   * @param id 挑战ID
   * @param user 当前用户
   * @returns 删除结果
   */
  @ChallengeDoc.forRoute('/remove/:id')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/remove/:id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserData) {
    await this.challengesService.remove(id, user);
    return responseSuccess('ok', {}, '删除成功');
  }

  /**
   * 更新挑战，需要管理员及以上的权限，超级管理员可以更新所有挑战。
   * @param id 挑战ID
   * @param body 更新挑战数据
   * @param user 当前用户
   * @returns 更新后的挑战数据
   */
  @ChallengeDoc.forRoute('/update/:id')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateChallengeDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.challengesService.update(id, body, user);
    const filteredResult = filterData(UserGetChallengeDto, result);
    return responseSuccess('ok', filteredResult, '更新成功');
  }

  /**
   * 管理员切换挑战状态，需要管理员及以上的权限，超级管理员可以切换所有挑战状态。
   *
   * 要求挑战状态必须在 `ready` 以上。
   *
   * @param body 挑战ID
   * - `id` 挑战ID
   * - `status` 挑战状态
   * @param user 当前用户
   * - `published` 发布
   * - `closed` 关闭
   */
  @ChallengeDoc.forRoute('/switch-status')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/switch-status')
  async switchStatus(
    @Body() body: ChallengeSwitchStatusDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.challengesService.switchStatus(body, user);
    const filteredResult = filterData(UserGetChallengeDto, result);
    return responseSuccess('ok', filteredResult, '切换成功');
  }

  /**
   * 上传标准答案。
   *
   * 调用该接口会覆盖性地上传标准答案。
   *
   * @param body 挑战ID
   * - `challengeId` 挑战ID
   * - `content` 标准答案内容
   * @param user 当前用户
   */
  @ChallengeDoc.forRoute('/upload-standard-answer')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/upload-standard-answer')
  async uploadStandardAnswer(
    @CurrentUser() user: UserData,
    @Body()
    body: {
      challengeId: string;
      content: string;
    },
  ) {
    const result = await this.challengesService.uploadStandardAnswer({
      challengeId: body.challengeId,
      standardAnswer: body.content,
      user,
    });
    return responseSuccess('ok', result, '上传成功');
  }

  /**
   * 上传用户作答模板。
   *
   * 调用该接口会覆盖性地上传用户作答模板。
   *
   * 文件大小限制为 2MB，只能上传文本文件。
   *
   * @param body 挑战ID
   * - `challengeId` 挑战ID
   * @param user 当前用户
   * @param files 用户作答模板文件
   */
  @ChallengeDoc.forRoute('/upload-answer-templates')
  @UseFileInceptor('files', 2, 'text/')
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/upload-answer-templates')
  async uploadAnswerTemplates(
    @CurrentUser() user: UserData,
    @UploadedFiles() files: MulterFile[],
    @Body() body: { challengeId: string },
  ) {
    const result = await this.challengesService.uploadAnswerTemplate({
      answerTemplates: files,
      challengeId: body.challengeId,
      user,
    });
    return responseSuccess('ok', result, '上传成功');
  }

  /**
   * 获取挑战 ID 获取所有作答模板的下载地址。
   * @param challengeId 挑战ID
   * @throws
   * - `not found` 挑战不存在
   * - `internal server error` 获取用户作答模板URL失败
   */
  @ChallengeDoc.forRoute('/download-answer-template')
  @HttpCode(200)
  @Auth()
  @Get('/download-answer-template')
  async getAnswerTemplateDownloadUrl(
    @Query('challengeId') challengeId: string,
  ) {
    const result =
      await this.challengesService.getAnswerTemplateUrl(challengeId);
    return responseSuccess('ok', result, '获取成功');
  }
}
