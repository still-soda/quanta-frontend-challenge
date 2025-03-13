import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  UploadedFile,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Auth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSuccess } from '../../utils/http-response.utils';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { NotificationSwitchStatusDto } from './dto/switch-status.dto';
import { NotificationsDoc } from './notifications.doc';
import { MulterFile } from '../assets/assets.service';
import { UseFileInterceptor } from '../../common/decorators/file.decorator';

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
  @NotificationsDoc.forRoute('/create')
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
  @NotificationsDoc.forRoute('/update/:id')
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
  @NotificationsDoc.forRoute('/switch-status')
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
  @NotificationsDoc.forRoute('/delete/:id')
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
  @NotificationsDoc.forRoute('/admin-find-all')
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
  @NotificationsDoc.forRoute('/find-all-published')
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
  @NotificationsDoc.forRoute('/detail/:id')
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
  @NotificationsDoc.forRoute('/admin-detail/:id')
  @Auth(ROLE.ADMIN)
  @Get('/admin-detail/:id')
  async adminGetDetail(@Param('id') id: string, @CurrentUser() user: UserData) {
    const result = await this.notificationsService.adminGetDetail(id, user);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 上传公告封面，需要管理员及以上权限。
   * @param file 封面文件
   * @param notificationId 公告ID
   * @param user 当前用户
   * @returns 封面链接
   * @throws
   * - `not found` 公告不存在
   * - `bad request` DTO数据校验失败
   * - `forbidden` 非超级管理员无法代替他人更新公告
   */
  @NotificationsDoc.forRoute('/upload-cover')
  @UseFileInterceptor('file', 5, 'image/')
  @Auth(ROLE.ADMIN)
  @Post('/upload-cover')
  async uploadCover(
    @UploadedFile() file: MulterFile,
    @Body('id') notificationId: string,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.notificationsService.uploadCover(
      notificationId,
      file,
      user,
    );
    return responseSuccess('ok', result, '上传成功');
  }
}
