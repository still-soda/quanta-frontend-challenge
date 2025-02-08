import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ApiNeedAuth,
  Auth,
  ROLE,
} from '../../common/decorators/auth.decorator';
import {
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { notifacationProp } from './dto/notification.dto';
import { NotificationSwitchStatusDto } from './dto/switch-status.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 创建公告，需要管理员及以上权限。
   * @param createNotificationDto 创建公告数据
   * - `title` 公告标题
   * - `description` 公告简介
   * - `authorId` 作者ID
   * - `content` 公告内容
   * - `coverUrl` 封面链接
   * @param user 当前用户
   * @returns 创建的公告数据
   * @throws
   * - `bad request` DTO数据校验失败
   * - `internal server error` 保存文章文件失败
   */
  @ApiOperation({
    summary: '创建公告',
    description: '创建公告，需要管理员及以上权限',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '创建成功',
    schema: responseSchema('created', '创建成功', {
      type: 'object',
      properties: notifacationProp,
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数错误',
    schema: responseSchema('bad request', '${error.message}'),
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '保存文章文件失败',
    schema: responseSchema('internal server error', '保存文章文件失败'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员无法代替他人创建公告',
    schema: responseSchema('forbidden', '非超级管理员无法代替他人创建公告'),
  })
  @HttpCode(201)
  @Auth(ROLE.ADMIN)
  @Post('/create')
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.notificationsService.create(
      user,
      createNotificationDto,
    );

    return responseSuccess('created', result, '创建成功');
  }

  /**
   * 更新公告内容，需要管理员及以上权限。
   * @param notificationId 公告ID
   * @param updateNotificationDto 更新公告数据
   * - `title` 公告标题
   * - `description` 公告简介
   * - `content` 公告内容
   * - `coverUrl` 封面链接
   * @param user 当前用户
   * @returns 更新后的公告数据
   * @throws
   * - `bad request` DTO数据校验失败
   * - `not found` 公告不存在
   * - `forbidden` 非超级管理员无法代替他人更新公告
   */
  @ApiOperation({
    summary: '更新公告内容',
    description: '更新公告内容，需要管理员及以上权限',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    schema: responseSchema('ok', '更新成功', {
      type: 'object',
      properties: notifacationProp,
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数错误',
    schema: responseSchema('bad request', '${error.message}'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '公告不存在',
    schema: responseSchema('not found', '公告不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员无法代替他人更新公告',
    schema: responseSchema('forbidden', '非超级管理员无法代替他人更新公告'),
  })
  @HttpCode(200)
  @Auth(ROLE.ADMIN)
  @Post('/udpate/:id')
  async update(
    @Param('id') notificationId: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.notificationsService.userUpdate(
      notificationId,
      user,
      updateNotificationDto,
    );
    return responseSuccess('ok', result, '更新成功');
  }

  /**
   * 切换公告状态，需要管理员及以上权限。
   * @param body 切换状态数据
   * - `id` 公告ID
   * - `status` 公告状态
   * @param user 当前用户
   * @returns 切换成功
   * @throws
   * - `bad request` 参数错误
   * - `not found` 公告不存在
   * - `forbidden` 非超级管理员无法代替他人更新公告
   */
  @ApiOperation({
    summary: '切换公告状态',
    description: '切换公告状态，需要管理员及以上权限',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '切换成功',
    schema: responseSchema('ok', '（撤回 / 发布）成功', {
      type: 'object',
      properties: notifacationProp,
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数错误',
    schema: responseSchema('bad request', '${error.message}'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '公告不存在',
    schema: responseSchema('not found', '公告不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员无法代替他人更新公告',
    schema: responseSchema('forbidden', '非超级管理员无法代替他人更新公告'),
  })
  @Auth(ROLE.ADMIN)
  @Post('/switch-status')
  async switchStatus(
    @Body() body: NotificationSwitchStatusDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.notificationsService.switchStatus(user, body);
    const msg = body.status === 'draft' ? '撤回成功' : '发布成功';
    return responseSuccess('ok', result, msg);
  }

  /**
   * 删除公告，需要管理员及以上权限。
   * @param id 公告ID
   * @returns 删除成功
   * @throws
   * - `not found` 公告不存在
   * - `forbidden` 非超级管理员无法代替他人删除公告
   * - `bad request` ID无效
   */
  @ApiOperation({
    summary: '删除公告',
    description: '删除公告，需要管理员及以上权限',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功',
    schema: responseSchema('ok', '删除成功'),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '公告不存在',
    schema: responseSchema('not found', '公告不存在'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员无法代替他人删除公告',
    schema: responseSchema('forbidden', '非超级管理员无法代替他人删除公告'),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID无效',
    schema: responseSchema('bad request', 'ID无效'),
  })
  @Auth(ROLE.ADMIN)
  @Post('/delete/:id')
  async delete(@Param('id') id: string, @CurrentUser() user: UserData) {
    const result = await this.notificationsService.remove(id, user);
    return responseSuccess('ok', result, '删除成功');
  }

  /**
   * 获取所有公告，需要管理员及以上权限。
   *
   * 如果是超级管理员，可以获取所有公告，否则只能获取自己发布的公告。
   *
   * @param user 当前用户
   * @returns 公告列表
   */
  @ApiOperation({
    summary: '管理员获取所有公告',
    description:
      '如果是超级管理员，可以获取所有公告，否则只能获取自己发布的公告',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'array',
      items: {
        type: 'object',
        properties: notifacationProp,
      },
    }),
  })
  @Auth(ROLE.ADMIN)
  @Get('/admin-find-all')
  async adminFindAll(@CurrentUser() user: UserData) {
    const result = await this.notificationsService.adminFindAll(user);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取所有已经发布的公告，用于给用户提供获取公告的服务。
   * @returns 公告列表
   */
  @ApiOperation({
    summary: '获取所有已发布的公告',
    description: '用于给用户提供获取公告的服务',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'array',
      items: {
        type: 'object',
        properties: notifacationProp,
      },
    }),
  })
  @Get('/find-all-published')
  async findAllPublished() {
    const result = await this.notificationsService.findAllPublished();
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 用户获取指定ID的公告内容。
   * @param id 公告ID
   * @returns 公告详情
   * @throws
   * - `not found` 公告不存在
   * - `bad request` ID无效
   */
  @ApiOperation({ summary: '获取指定ID的公告详情' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'string',
      example: '公告内容',
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '公告不存在',
    schema: responseSchema('not found', '公告不存在'),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID无效',
    schema: responseSchema('bad request', 'ID无效'),
  })
  @Get('/detail/:id')
  async getDetail(@Param('id') id: string) {
    const result = await this.notificationsService.userGetDetail(id);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 管理员获取指定ID的公告详情。
   *
   * 如果用户是超级管理员，则可以获取所有公告详情，否则只能获取自己发布的公告详情。
   *
   * @param id 公告ID
   * @param user 当前用户
   * @returns 公告详情
   * @throws
   * - `not found` 公告不存在
   * - `bad request` ID无效
   * - `forbidden` 非超级管理员无法获取他人未发布的公告
   */
  @ApiOperation({
    summary: '管理员获取指定ID的公告详情',
    description: '管理员获取指定ID的公告详情',
  })
  @ApiNeedAuth({ level: ROLE.ADMIN })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'string',
      example: '公告内容',
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '公告不存在',
    schema: responseSchema('not found', '公告不存在'),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID无效',
    schema: responseSchema('bad request', 'ID无效'),
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '非超级管理员无法获取他人未发布的公告',
    schema: responseSchema('forbidden', '非超级管理员无法获取他人未发布的公告'),
  })
  @Auth(ROLE.ADMIN)
  @Get('/admin-detail/:id')
  async adminGetDetail(@Param('id') id: string, @CurrentUser() user: UserData) {
    const result = await this.notificationsService.adminGetDetail(id, user);
    return responseSuccess('ok', result, '获取成功');
  }
}
