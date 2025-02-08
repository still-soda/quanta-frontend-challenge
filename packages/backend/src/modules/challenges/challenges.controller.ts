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
import { CreateChallengeDto } from './dto/create-challenge.dto';
import {
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { filterData } from '../../utils/filter-data.utils';
import {
  UserGetChallengeDto,
  userGetChallengeProps,
} from './dto/user-get-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  /**
   * 用户获取所有发布的挑战。
   */
  @ApiOperation({
    summary: '获取所有发布的挑战',
    description: '用户获取所有挑战',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'array',
      items: { type: 'object', properties: userGetChallengeProps },
    }),
  })
  @HttpCode(200)
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
  @ApiOperation({
    summary: '获取所有挑战',
    description:
      '管理员获取所有挑战，需要管理员及以上的权限，超级管理员可以获取所有挑战',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'array',
      items: { type: 'object', properties: userGetChallengeProps },
    }),
  })
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
  @ApiOperation({
    summary: '获取挑战详情',
    description: '用户获取挑战详情',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'string',
      example: '挑战内容',
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID 无效',
    schema: responseSchema('bad request', 'ID 无效'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '挑战不存在',
    schema: responseSchema('not found', '挑战不存在'),
  })
  @HttpCode(200)
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
  @ApiOperation({
    summary: '获取挑战详情',
    description:
      '管理员获取挑战详情，需要管理员及以上的权限，超级管理员可以获取所有详情',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'string',
      example: '挑战内容',
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID 无效',
    schema: responseSchema('bad request', 'ID 无效'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '挑战不存在',
    schema: responseSchema('not found', '挑战不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员不能代替别人获取挑战详情',
    schema: responseSchema('forbidden', '非超级管理员不能代替别人获取挑战详情'),
  })
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
        properties: userGetChallengeProps,
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
  @ApiOperation({
    summary: '删除挑战',
    description:
      '管理员删除挑战，需要管理员及以上的权限，超级管理员可以删除所有挑战',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功',
    schema: responseSchema('ok', '删除成功'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '挑战不存在',
    schema: responseSchema('not found', '挑战不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员不能代替别人删除挑战',
    schema: responseSchema('forbidden', '非超级管理员不能代替别人删除挑战'),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID 无效',
    schema: responseSchema('bad request', 'ID 无效'),
  })
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
  @ApiOperation({
    summary: '更新挑战',
    description: '更新挑战，需要管理员及以上的权限，超级管理员可以更新所有挑战',
  })
  @ApiBody({ type: UpdateChallengeDto })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    schema: responseSchema('ok', '更新成功', {
      type: 'array',
      items: { type: 'object', properties: userGetChallengeProps },
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '数据验证失败',
    schema: responseSchema('bad request', '数据验证失败'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '挑战不存在',
    schema: responseSchema('not found', '挑战不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员不能代替别人更新挑战',
    schema: responseSchema('forbidden', '非超级管理员不能代替别人更新挑战'),
  })
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
  @ApiOperation({
    summary: '切换挑战状态',
    description:
      '管理员切换挑战状态，需要管理员及以上的权限，超级管理员可以切换所有挑战状态。\n' +
      '要求挑战状态必须在 `ready` 以上才能被设置。',
  })
  @ApiBody({ type: ChallengeSwitchStatusDto })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '切换成功',
    schema: responseSchema('ok', '切换成功', {
      type: 'array',
      items: { type: 'object', properties: userGetChallengeProps },
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '数据验证失败',
    schema: responseSchema('bad request', '${error.message}'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '挑战不存在',
    schema: responseSchema('not found', '挑战不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      '1. 非超级管理员不能代替别人切换挑战状态\n' +
      '2. 挑战未就绪，挑战状态必须在 `ready` 及以上才能被设置',
    schema: responseSchema(
      'forbidden',
      '非超级管理员不能代替别人切换挑战状态 / 挑战未就绪',
    ),
  })
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
}
