import { Controller, Get, Query } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { Auth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSuccess } from '../../utils/http-response.utils';
import { UseCache } from '../../common/decorators/cache.decorator';
import { SubmissionsDoc } from './submissions.doc';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  /**
   * 获取我的提交
   * @param user 当前用户
   * @returns 我的提交
   */
  @SubmissionsDoc.forRoute('/my-submissions')
  @Get('/my-submissions')
  @Auth()
  async findMySubmissions(@CurrentUser() user: UserData) {
    const result = await this.submissionsService.findAllByUserId(user.id);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 根据ID获取我的某个提交
   * @param user 当前用户
   * @param submissionId 提交 ID
   * @returns 我的提交
   * @throws
   * - `forbidden`: 非管理员无权查看他人提交记录
   * - `not found`: 提交记录不存在
   */
  @SubmissionsDoc.forRoute('/one-submission')
  @Get('/one-submission')
  @Auth()
  async findMySubmissionById(
    @CurrentUser() user: UserData,
    @Query('submissionId') submissionId: string,
  ) {
    const result = await this.submissionsService.fineOneSubmission(
      submissionId,
      user,
    );
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取某个用户的提交，只有管理员可以调用
   * @param userId 用户 ID
   * @returns 用户的提交
   */
  @SubmissionsDoc.forRoute('/someones-submissions')
  @Get('/someones-submissions')
  @Auth(ROLE.ADMIN)
  async findSomeonesSubmissions(@Query('userId') userId: string) {
    const result = await this.submissionsService.findAllByUserId(userId);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取某个挑战的提交数量，缓存 2 分钟
   * @param challengeId 挑战 ID
   * @returns 提交数量
   */
  @SubmissionsDoc.forRoute('/count')
  @Get('/count')
  @UseCache(120)
  async getSubmissionCountByChallengeId(
    @Query('challengeId') challengeId: string,
  ) {
    const count = await this.submissionsService.getSubmissionCountOfChallenge(
      challengeId,
      { type: 'execute' },
    );
    return responseSuccess('ok', { count }, '获取成功');
  }

  /**
   * 获取某个挑战的通过率，缓存 2 分钟
   * @param challengeId 挑战 ID
   * @returns 通过率
   */
  @SubmissionsDoc.forRoute('/passed-rate')
  @Get('/passed-rate')
  @UseCache(120)
  async getPassedRateByChallengeId(@Query('challengeId') challengeId: string) {
    const passedCount =
      await this.submissionsService.getSubmissionCountOfChallenge(challengeId, {
        type: 'execute',
        status: 'passed',
      });
    const totalCount =
      await this.submissionsService.getSubmissionCountOfChallenge(challengeId, {
        type: 'execute',
      });
    const rate = totalCount === 0 ? 0 : passedCount / totalCount;

    return responseSuccess('ok', { rate }, '获取成功');
  }

  /**
   * 获取某个挑战的提交记录
   * @param challengeId 挑战 ID
   * @returns 提交记录
   */
  @SubmissionsDoc.forRoute('/records')
  @Get('/records')
  @Auth(ROLE.ADMIN)
  async getSubmissionRecordsByChallengeId(
    @Query('challengeId') challengeId: string,
  ) {
    const records =
      await this.submissionsService.getSubmissionOfChallenge(challengeId);
    return responseSuccess('ok', records, '获取成功');
  }
}
