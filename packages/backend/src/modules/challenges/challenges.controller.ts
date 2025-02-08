import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import {
  ApiNeedAuth,
  Auth,
  ROLE,
} from '../../common/decorators/auth.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { ChallengeSwitchStatusDto } from './dto/switch-status.dto';
import {
  CreateChallengeDto,
  createChallengeProps,
} from './dto/create-challenge.dto';
import {
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  /**
   * 用户获取所有挑战。
   */
  @ApiOperation({
    summary: '获取所有挑战',
    description: '用户获取所有挑战',
  })
  @HttpCode(200)
  @Get('/find-all')
  async findAll() {}

  /**
   * 管理员获取所有挑战，需要管理员及以上的权限，超级管理员可以获取所有挑战。
   * @param user 当前用户
   */
  @ApiOperation({
    summary: '获取所有挑战',
    description:
      '管理员获取所有挑战，需要管理员及以上的权限，超级管理员可以获取所有挑战',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Get('/admin-find-all')
  async adminFindAll(@CurrentUser() user: UserData) {}

  /**
   * 用户获取挑战详情。
   * @param id 挑战ID
   */
  @ApiOperation({
    summary: '获取挑战详情',
    description: '用户获取挑战详情',
  })
  @HttpCode(200)
  @Get('/detail/:id')
  async getDetail(@Param('id') id: string) {}

  /**
   * 管理员获取挑战详情，需要管理员及以上的权限，超级管理员可以获取所有详情。
   * @param id 挑战ID
   * @param user 当前用户
   */
  @ApiOperation({
    summary: '获取挑战详情',
    description:
      '管理员获取挑战详情，需要管理员及以上的权限，超级管理员可以获取所有详情',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Get('/admin-detail/:id')
  async adminGetDetail(
    @Param('id') id: string,
    @CurrentUser() user: UserData,
  ) {}

  /**
   * 创建挑战。
   * @param body 创建挑战数据
   * @param user 当前用户
   * @returns 创建的挑战数据
   */
  @ApiOperation({
    summary: '创建挑战',
    description: '创建挑战',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiBody({ type: CreateChallengeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '创建成功',
    schema: responseSchema('ok', '创建成功', {
      type: 'array',
      items: {
        type: 'object',
        properties: createChallengeProps,
      },
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '数据验证失败',
    schema: responseSchema('bad request', '数据验证失败'),
  })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/create')
  async create(
    @Body() body: CreateChallengeDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.challengesService.adminCreate(user, body);
    return responseSuccess('ok', result, '创建成功');
  }

  /**
   * 管理员删除挑战，需要管理员及以上的权限，超级管理员可以删除所有挑战。
   * @param id 挑战ID
   * @param user 当前用户
   * @returns 删除结果
   */
  @ApiOperation({
    summary: '删除挑战',
    description:
      '管理员删除挑战，需要管理员及以上的权限，超级管理员可以删除所有挑战',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/remove/:id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserData) {}

  /**
   * 更新挑战，需要管理员及以上的权限，超级管理员可以更新所有挑战。
   * @param id 挑战ID
   * @param body 更新挑战数据
   * @param user 当前用户
   * @returns 更新后的挑战数据
   */
  @ApiOperation({
    summary: '更新挑战',
    description: '更新挑战，需要管理员及以上的权限，超级管理员可以更新所有挑战',
  })
  @ApiBody({ type: ChallengeSwitchStatusDto })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: UserData,
  ) {}

  /**
   * 管理员切换挑战状态，需要管理员及以上的权限，超级管理员可以切换所有挑战状态。
   *
   * 要求挑战状态必须在 `ready` 以上。
   * @param body 挑战ID
   * - `id` 挑战ID
   * - `status` 挑战状态
   * @param user 当前用户
   * - `published` 发布
   * - `closed` 关闭
   */
  @ApiOperation({
    summary: '切换挑战状态',
    description:
      '管理员切换挑战状态，需要管理员及以上的权限，超级管理员可以切换所有挑战状态。\n' +
      '要求挑战状态必须在 `ready` 以上才能被设置。',
  })
  @ApiBody({ type: ChallengeSwitchStatusDto })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/switch-status')
  async switchStatus(
    @Body() body: ChallengeSwitchStatusDto,
    @CurrentUser() user: UserData,
  ) {}
}
