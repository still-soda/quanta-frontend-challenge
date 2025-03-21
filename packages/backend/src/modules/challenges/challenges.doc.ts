import { HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ApiNeedAuth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { ChallengeSwitchStatusDto } from './dto/switch-status.dto';
import { userGetChallengeProps } from './dto/user-get-challenge.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { adminGetChallengeProps } from './dto/admin-get-challenge.dto';
import { getTagDtoProps } from '../tags/dto/get-tag.dto';

/**
 * 挑战模块的 Swagger 接口文档。
 */
export const ChallengeDoc = new ApiDocumentHelper({
  '/upload-answer-templates': () => {
    return [
      ApiOperation({
        summary: '上传用户作答模板',
        description:
          '调用该接口会覆盖性地上传用户作答模板。\n' +
          '文件大小限制为 2MB，只能上传文本文件。',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            challengeId: { type: 'string' },
            files: {
              type: 'array',
              items: { type: 'string', format: 'binary' },
            },
          },
          required: ['challengeId', 'files'],
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '上传成功',
        schema: responseSchema('ok', '上传成功'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员不能代替作者上传用户作答模板',
        schema: responseSchema(
          'forbidden',
          '非超级管理员不能代替作者上传用户作答模板',
        ),
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '上传用户作答模板失败',
        schema: responseSchema('internal server error', '上传用户作答模板失败'),
      }),
    ];
  },
  '/upload-standard-answer': () => {
    return [
      ApiOperation({
        summary: '上传标准答案',
        description: '调用该接口会覆盖性地上传标准答案。',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            challengeId: { type: 'string' },
            content: { type: 'string' },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '上传成功',
        schema: responseSchema('ok', '上传成功'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员不能代替作者上传标准答案',
        schema: responseSchema(
          'forbidden',
          '非超级管理员不能代替作者上传标准答案',
        ),
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '上传标准答案失败',
        schema: responseSchema('internal server error', '上传标准答案失败'),
      }),
    ];
  },
  '/switch-status': () => {
    return [
      ApiOperation({
        summary: '切换挑战状态',
        description:
          '管理员切换挑战状态，需要管理员及以上的权限，超级管理员可以切换所有挑战状态。\n' +
          '要求挑战状态必须在 `ready` 以上才能被设置。',
      }),
      ApiBody({ type: ChallengeSwitchStatusDto }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '切换成功',
        schema: responseSchema('ok', '切换成功', {
          type: 'array',
          items: { type: 'object', properties: adminGetChallengeProps },
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '数据验证失败',
        schema: responseSchema('bad request', '${error.message}'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description:
          '1. 非超级管理员不能代替别人切换挑战状态\n' +
          '2. 挑战未就绪，挑战状态必须在 `ready` 及以上才能被设置',
        schema: responseSchema(
          'forbidden',
          '非超级管理员不能代替别人切换挑战状态 / 挑战未就绪',
        ),
      }),
    ];
  },
  '/update/:id': () => {
    return [
      ApiOperation({
        summary: '更新挑战',
        description:
          '更新挑战，需要管理员及以上的权限，超级管理员可以更新所有挑战',
      }),
      ApiBody({ type: UpdateChallengeDto }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '更新成功',
        schema: responseSchema('ok', '更新成功', {
          type: 'array',
          items: { type: 'object', properties: userGetChallengeProps },
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '数据验证失败',
        schema: responseSchema('bad request', '数据验证失败'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员不能代替别人更新挑战',
        schema: responseSchema('forbidden', '非超级管理员不能代替别人更新挑战'),
      }),
    ];
  },
  '/remove/:id': () => {
    return [
      ApiOperation({
        summary: '删除挑战',
        description:
          '管理员删除挑战，需要管理员及以上的权限，超级管理员可以删除所有挑战',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '删除成功',
        schema: responseSchema('ok', '删除成功'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员不能代替别人删除挑战',
        schema: responseSchema('forbidden', '非超级管理员不能代替别人删除挑战'),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID 无效',
        schema: responseSchema('bad request', 'ID 无效'),
      }),
    ];
  },
  '/create': () => {
    return [
      ApiOperation({
        summary: '创建挑战',
        description: '创建挑战',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiBody({ type: CreateChallengeDto }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '创建成功',
        schema: responseSchema('ok', '创建成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: userGetChallengeProps,
          },
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '数据验证失败',
        schema: responseSchema('bad request', '数据验证失败'),
      }),
    ];
  },
  '/admin-detail/:id': () => {
    return [
      ApiOperation({
        summary: '获取挑战详情',
        description:
          '管理员获取挑战详情，需要管理员及以上的权限，超级管理员可以获取所有详情',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'string',
          example: '挑战内容',
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID 无效',
        schema: responseSchema('bad request', 'ID 无效'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '非超级管理员不能代替别人获取挑战详情',
        schema: responseSchema(
          'forbidden',
          '非超级管理员不能代替别人获取挑战详情',
        ),
      }),
    ];
  },
  '/detail/:id': () => {
    return [
      ApiOperation({
        summary: '获取挑战详情',
        description: '用户获取挑战详情',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'string',
          example: '挑战内容',
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID 无效',
        schema: responseSchema('bad request', 'ID 无效'),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
    ];
  },
  '/admin-find-all': () => {
    return [
      ApiOperation({
        summary: '获取所有挑战',
        description:
          '管理员获取所有挑战，需要管理员及以上的权限，超级管理员可以获取所有挑战',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: { type: 'object', properties: adminGetChallengeProps },
        }),
      }),
    ];
  },
  '/find-all': () => {
    return [
      ApiOperation({
        summary: '获取所有发布的挑战',
        description: '用户获取所有挑战',
      }),
      ApiQuery({
        name: 'include',
        example: [1, 2, 3],
        description: '只查询存在 include 列表中标签的数据',
        required: false,
      }),
      ApiQuery({
        name: 'all',
        example: [1, 2, 3],
        description: '只查询有 all 列表中所有标签的数据',
        required: false,
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...userGetChallengeProps,
              tags: {
                type: 'array',
                items: {
                  type: 'object',
                  example: '标签',
                  properties: getTagDtoProps,
                },
              },
            },
          },
        }),
      }),
    ];
  },
  '/download-answer-template': () => {
    return [
      ApiOperation({
        summary: '获取作答模板下载地址',
        description: '获取挑战 ID 获取所有作答模板的下载地址。',
      }),
      ApiNeedAuth(),
      ApiQuery({
        name: 'challengeId',
        type: 'string',
        description: '挑战 ID',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: { type: 'string', example: '/static/example.html' },
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '挑战不存在',
        schema: responseSchema('not found', '挑战不存在'),
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '获取用户作答模板URL失败',
        schema: responseSchema(
          'internal server error',
          '获取用户作答模板URL失败',
        ),
      }),
    ];
  },
  '/get-latest-challenges': () => {
    return [
      ApiOperation({
        summary: '获取最新的挑战',
        description: '5 个最新的挑战',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...userGetChallengeProps,
              content: {
                type: 'string',
                example: '挑战内容',
                description: '挑战内容',
              },
            },
          },
        }),
      }),
    ];
  },
  '/upload-answer': () => {
    return [
      ApiOperation({
        summary: '上传用户作答',
        description:
          '文件大小限制为 2MB，只能上传文本文件。上传成功后会返回一个 `answerId` 数组，用于后续查询作答结果。',
      }),
      ApiNeedAuth(),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        description: '用户作答文件',
        schema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string', format: 'binary' },
            },
          },
          required: ['files'],
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '上传成功',
        schema: responseSchema('ok', '上传成功', {
          type: 'array',
          items: { type: 'string', example: 'answerId' },
        }),
      }),
    ];
  },
  '/find-one': () => {
    return [
      ApiOperation({
        summary: '获取一个挑战',
        description: '用户获取一个挑战',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: {
            ...userGetChallengeProps,
            tags: {
              type: 'array',
              items: {
                type: 'object',
                example: '标签',
                properties: getTagDtoProps,
              },
            },
          },
        }),
      }),
    ];
  },
  '/admin-find-one': () => {
    return [
      ApiOperation({
        summary: '管理员根据 ID 获取一个挑战',
        description: '需要管理员及以上的权限，超级管理员可以获取所有挑战',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: adminGetChallengeProps,
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'ID 无效',
        schema: responseSchema('bad request', 'ID 无效'),
      }),
    ];
  },
  '/total-score': () => {
    return [
      ApiOperation({
        summary: '获取所有挑战的总分',
        description: '获取所有挑战的总分',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'number',
          example: 100,
        }),
      }),
    ];
  },
  '/upload-template-image': () => {
    return [
      ApiOperation({
        summary: '上传挑战封面图片',
        description: '上传挑战封面图片',
      }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
          },
          required: ['file'],
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '上传成功',
        schema: responseSchema('ok', '上传成功'),
      }),
    ];
  },
});
