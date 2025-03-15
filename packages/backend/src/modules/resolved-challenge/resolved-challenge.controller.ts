import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { ResolvedChallengeService } from './resolved-challenge.service';
import { responseError, responseSuccess } from 'src/utils/http-response.utils';
import { ResolvedDoc } from './resolved-challenge.doc';
import { Auth, ROLE } from 'src/common/decorators/auth.decorator';
import { CurrentUser, UserData } from 'src/common/decorators/user.decorator';

@Controller('resolved-challenge')
export class ResolvedChallengeController {
  constructor(
    private readonly resolvedChallengeService: ResolvedChallengeService,
  ) {}

  /**
   * 获取挑战的前三名解决记录
   * @param challengeId 挑战 ID
   * @returns 前三名解决记录
   */
  @ResolvedDoc.forRoute('/earliest-three-of-challenge')
  @HttpCode(200)
  @Get('/earliest-three-of-challenge')
  async getEarliestThreeResolvedChallenges(
    @Query('challengeId') challengeId: string,
  ) {
    const result =
      await this.resolvedChallengeService.getEarliestThreeResolvedChallenges(
        challengeId,
      );
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取用户解决记录中是前三名的记录
   * @param userId 用户 ID
   * @throws
   * - `forbidden`: 无权查看他人解决记录
   */
  @ResolvedDoc.forRoute('/earliest-of-user')
  @HttpCode(200)
  @Get('/earliest-of-user')
  @Auth()
  async getUserEarliestResolvedChallenge(
    @Query('userId') userId: string,
    @CurrentUser() user: UserData,
  ) {
    if (user.id !== userId && user.role < ROLE.ADMIN) {
      throw responseError('forbidden', { msg: '无权查看他人解决记录' });
    }

    const result =
      await this.resolvedChallengeService.getUserEarliestResolvedChallenge(
        userId,
      );
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取挑战的解决记录
   * @param challengeId 挑战ID
   * @param page 页数
   * @param limit 每页数量
   * @throws
   * - `bad request`: challengeId 不能为空
   */
  @ResolvedDoc.forRoute('/by-challenge-id')
  @HttpCode(200)
  @Get('/by-challenge-id')
  @Auth(ROLE.ADMIN)
  async getResolvedChallengeByChallengeId(
    @Query('challengeId') challengeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!challengeId) {
      throw responseError('bad request', { msg: 'challengeId 不能为空' });
    }

    const result =
      await this.resolvedChallengeService.getResolvedChallengeByChallengeId({
        challengeId,
        page,
        limit,
      });
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取用户的解决记录
   * @param userId 用户ID
   * @param page 页数
   * @param limit 每页数量
   * @throws
   * - `bad request`: userId 不能为空
   * - `forbidden`: 无权查看他人解决记录
   */
  @ResolvedDoc.forRoute('/by-user-id')
  @HttpCode(200)
  @Get('/by-user-id')
  @Auth()
  async getResolvedChallengeByUserId(
    @CurrentUser() user: UserData,
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!userId) {
      throw responseError('bad request', { msg: 'userId 不能为空' });
    }

    if (user.id !== userId && user.role < ROLE.ADMIN) {
      throw responseError('forbidden', { msg: '无权查看他人解决记录' });
    }

    const result =
      await this.resolvedChallengeService.getResolvedChallengeByUserId({
        userId,
        page,
        limit,
      });
    return responseSuccess('ok', result, '获取成功');
  }
}
