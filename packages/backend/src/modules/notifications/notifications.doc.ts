import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiNeedAuth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { notifacationProp } from './dto/notification.dto';

export const NotificationsDoc = new ApiDocumentHelper({
  '/create': () => {
    return [
      ApiOperation({
        summary: '创建公告',
        description: '创建公告，需要管理员及以上权限',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: '创建成功',
        schema: responseSchema('created', '创建成功', {
          type: 'object',
          properties: notifacationProp,
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '参数错误',
        schema: responseSchema('bad request', '${error.message}'),
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '保存文章文件失败',
        schema: responseSchema('internal server error', '保存文章文件失败'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员无法代替他人创建公告',
        schema: responseSchema('forbidden', '非超级管理员无法代替他人创建公告'),
      }),
    ];
  },
  '/update/:id': () => {
    return [
      ApiOperation({
        summary: '更新公告内容',
        description: '更新公告内容，需要管理员及以上权限',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '更新成功',
        schema: responseSchema('ok', '更新成功', {
          type: 'object',
          properties: notifacationProp,
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '参数错误',
        schema: responseSchema('bad request', '${error.message}'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '公告不存在',
        schema: responseSchema('not found', '公告不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员无法代替他人更新公告',
        schema: responseSchema('forbidden', '非超级管理员无法代替他人更新公告'),
      }),
    ];
  },
  '/switch-status': () => {
    return [
      ApiOperation({
        summary: '切换公告状态',
        description: '切换公告状态，需要管理员及以上权限',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '切换成功',
        schema: responseSchema('ok', '（撤回 / 发布）成功', {
          type: 'object',
          properties: notifacationProp,
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '参数错误',
        schema: responseSchema('bad request', '${error.message}'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '公告不存在',
        schema: responseSchema('not found', '公告不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员无法代替他人更新公告',
        schema: responseSchema('forbidden', '非超级管理员无法代替他人更新公告'),
      }),
    ];
  },
  '/delete/:id': () => {
    return [
      ApiOperation({
        summary: '删除公告',
        description: '删除公告，需要管理员及以上权限',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '删除成功',
        schema: responseSchema('ok', '删除成功'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '公告不存在',
        schema: responseSchema('not found', '公告不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员无法代替他人删除公告',
        schema: responseSchema('forbidden', '非超级管理员无法代替他人删除公告'),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID无效',
        schema: responseSchema('bad request', 'ID无效'),
      }),
    ];
  },
  '/admin-find-all': () => {
    return [
      ApiOperation({
        summary: '管理员获取所有公告',
        description:
          '如果是超级管理员，可以获取所有公告，否则只能获取自己发布的公告',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: notifacationProp,
          },
        }),
      }),
    ];
  },
  '/find-all-published': () => {
    return [
      ApiOperation({
        summary: '获取所有已发布的公告',
        description: '用于给用户提供获取公告的服务',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: notifacationProp,
          },
        }),
      }),
    ];
  },
  '/detail/:id': () => {
    return [
      ApiOperation({ summary: '获取指定ID的公告详情' }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'string',
          example: '公告内容',
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '公告不存在',
        schema: responseSchema('not found', '公告不存在'),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID无效',
        schema: responseSchema('bad request', 'ID无效'),
      }),
    ];
  },
  '/admin-detail/:id': () => {
    return [
      ApiOperation({
        summary: '管理员获取指定ID的公告详情',
        description: '管理员获取指定ID的公告详情',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'string',
          example: '公告内容',
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '公告不存在',
        schema: responseSchema('not found', '公告不存在'),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID无效',
        schema: responseSchema('bad request', 'ID无效'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员无法获取他人未发布的公告',
        schema: responseSchema(
          'forbidden',
          '非超级管理员无法获取他人未发布的公告',
        ),
      }),
    ];
  },
});
