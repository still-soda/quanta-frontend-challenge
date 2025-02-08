import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AssetsService } from '../assets/assets.service';
import validateData from '../../utils/validate-data.utils';
import { responseError } from '../../utils/http-response.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notifications,
  NotificationsDocument,
  NotificationStatus,
} from '../../schemas/notifications.schema';
import { UserData } from '../../common/decorators/user.decorator';
import { ROLE } from '../../common/decorators/auth.decorator';
import { NotificationSwitchStatusDto } from './dto/switch-status.dto';
import { isMongoId } from 'class-validator';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notifications.name)
    private readonly notificationsModel: Model<NotificationsDocument>,
    private readonly assetsServive: AssetsService,
  ) {}

  /**
   * 该服务用于给用户提供创建公告服务。
   *
   * 会先保存文章内容到文件并获取文件ID，将文件ID存放到公告数据中，最后再保存公告到数据库。
   *
   * @param createNotificationDto 创建公告数据
   * - `title` 公告标题
   * - `description` 公告简介
   * - `authorId` 作者ID
   * - `content` 公告内容
   * - `coverUrl` 封面链接
   * @returns 创建的公告数据
   * @throws
   * - `bad request` DTO数据校验失败
   * - `internal server error` 保存文章文件失败
   * - `forbidden` 非超级管理员无法代替他人创建公告
   */
  async create(user: UserData, createNotificationDto: CreateNotificationDto) {
    try {
      createNotificationDto = await validateData(
        CreateNotificationDto,
        createNotificationDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    if (
      user.role < ROLE.SUPER_ADMIN &&
      createNotificationDto.authorId !== user.id
    ) {
      throw responseError('forbidden', {
        msg: '非超级管理员无法代替他人创建公告',
      });
    }

    const { title, content } = createNotificationDto;
    const name = `${title}.md`;
    const saveResult = await this.assetsServive.saveTextFile({
      content,
      name,
      mimeType: 'text/markdown',
    });

    if (!saveResult.ok) {
      throw responseError('internal server error', {
        msg: '保存文章文件失败',
        withoutStack: false,
      });
    }

    const result = await this.notificationsModel.create({
      ...createNotificationDto,
      contentId: saveResult.id,
    });
    return result;
  }

  /**
   * 用于给用户提供获取公告详情的服务。
   * @param id 公告ID
   * @returns 公告内容
   * @throws
   * - `not found` 公告不存在
   * - `bad request` ID无效
   */
  async userGetDetail(id: string): Promise<string> {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID无效' });
    }

    const notification = await this.notificationsModel.findById(id);
    if (!notification || notification.status !== 'published') {
      throw responseError('not found', { msg: '公告不存在' });
    }

    return await this.assetsServive.readTextFileById(notification.contentId);
  }

  /**
   * 用于给管理员及以上权限用户提供获取公告详情的服务。
   *
   * 如果用户是超级管理员，则可以获取所有公告详情，否则只能获取自己发布的公告详情。
   *
   * @param id 公告ID
   * @param user 当前用户
   * @returns 公告内容
   * @throws
   * - `not found` 公告不存在
   * - `bad request` ID无效
   * - `forbidden` 非超级管理员无法获取他人未发布的公告
   */
  async adminGetDetail(id: string, user: UserData): Promise<string> {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID无效' });
    }

    const notification = await this.notificationsModel.findById(id);
    if (!notification) {
      throw responseError('not found', { msg: '公告不存在' });
    }

    if (
      user.role < ROLE.SUPER_ADMIN &&
      notification.authorId !== user.id &&
      notification.status !== 'published'
    ) {
      throw responseError('forbidden', {
        msg: '非超级管理员无法获取他人未发布的公告',
      });
    }

    return await this.assetsServive.readTextFileById(notification.contentId);
  }

  /**
   * 用于给用户提供更新公告状态的服务。
   * @param user 当前用户
   * @param dto 更新公告状态数据
   * @returns 更新后的公告数据
   * @throws
   * - `not found` 公告不存在
   * - `forbidden` 非超级管理员无法代替他人更新公告
   * - `bad request` DTO数据校验失败
   */
  async switchStatus(user: UserData, dto: NotificationSwitchStatusDto) {
    try {
      dto = await validateData(NotificationSwitchStatusDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { id, status } = dto;
    const notification = await this.notificationsModel.findById(id);
    if (!notification) {
      throw responseError('not found', { msg: '公告不存在' });
    }

    if (user.role < ROLE.SUPER_ADMIN && notification.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员无法代替他人更新公告',
      });
    }

    return await this.notificationsModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  /**
   * 删除指定ID的公告。
   * @param id 公告ID
   * @param user 当前用户
   * @returns 删除的公告数据
   * @throws
   * - `not found` 公告不存在
   * - `forbidden` 非超级管理员无法代替他人删除公告
   * - `bad request` ID无效
   * - `internal server error` 删除文章文件失败
   */
  async remove(id: string, user: UserData) {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: 'ID无效' });
    }

    const notification = await this.notificationsModel.findById(id);
    if (!notification) {
      throw responseError('not found', { msg: '公告不存在' });
    }

    if (user.role < ROLE.SUPER_ADMIN && notification.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员无法代替他人删除公告',
      });
    }

    const ok = await this.assetsServive.deleteFile(notification.contentId);
    if (!ok) {
      throw responseError('internal server error', {
        msg: '删除文章文件失败',
        withoutStack: false,
      });
    }
    return await this.notificationsModel.findByIdAndDelete(id);
  }

  /**
   * 获取所有已经发布的公告, 用于给用户提供获取公告的服务。
   * @returns 公告数据列表
   */
  async findAllPublished() {
    const status: NotificationStatus = 'published';
    return await this.notificationsModel.find({ status });
  }

  /**
   * 获取所有公告，用于给管理员及以上权限用户提供获取公告的服务。
   *
   * 如果用户是超级管理员，则返回所有公告数据，否则只返回管理员自己发布的公告数据。
   *
   * @param user 当前用户
   * @returns 公告数据列表
   */
  async adminFindAll(user: UserData) {
    if (user.role >= ROLE.SUPER_ADMIN) {
      return await this.notificationsModel.find();
    }
    return await this.notificationsModel.find({ authorId: user.id });
  }

  /**
   * 获取指定ID的公告。
   * @param id 公告ID
   * @returns 指定ID的公告数据
   */
  async findOne(id: string) {
    return await this.notificationsModel.findById(id);
  }

  /**
   * 用于给用户提供更新指定ID公告的服务。
   * @param id 公告ID
   * @param user 当前用户
   * @param updateNotificationDto 更新公告数据
   * @returns 更新后的公告数据
   * @throws
   * - `not found` 公告不存在
   * - `bad request` DTO数据校验失败
   * - `forbidden` 非超级管理员无法代替他人更新公告
   */
  async userUpdate(
    id: string,
    user: UserData,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    const notification = await this.notificationsModel.findById(id);
    if (!notification) {
      throw responseError('not found', { msg: '公告不存在' });
    }

    if (user.role < ROLE.SUPER_ADMIN && notification.authorId !== user.id) {
      throw responseError('forbidden', {
        msg: '非超级管理员无法代替他人更新公告',
      });
    }

    try {
      updateNotificationDto = await validateData(
        UpdateNotificationDto,
        updateNotificationDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    return await this.notificationsModel.findByIdAndUpdate(
      id,
      updateNotificationDto,
      { new: true },
    );
  }
}
