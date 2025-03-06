import { HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ApiNeedAuth } from '../../common/decorators/auth.decorator';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { responseSchema } from '../../utils/http-response.utils';
import { guestGetUserDtoProps } from './dto/guest-get-user.dto';
import { ownerGetUserDtoProps } from './dto/owner-get-user.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { UserUpdateDto } from './dto/user-update.dto';

export const UserDoc = new ApiDocumentHelper({
  '/find-one': () => {
    return [
      ApiOperation({
        summary: '根据用户ID或用户名查找用户',
        description: '必须携带一个 Query 参数，两个都有的情况下优先 ID 查找',
      }),
      ApiQuery({ name: 'id', required: false, description: '用户ID' }),
      ApiQuery({ name: 'username', required: false, description: '用户名' }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '成功查找用户',
        schema: responseSchema('ok', '成功查找用户', {
          type: 'object',
          properties: guestGetUserDtoProps,
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '用户不存在',
        schema: responseSchema('not found', '用户不存在'),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '请求参数错误，必须提供 id 或 username',
        schema: responseSchema('bad request', '请求参数错误'),
      }),
    ];
  },
  '/find-self': () => {
    return [
      ApiOperation({ summary: '查找自己的用户信息' }),
      ApiNeedAuth(),
      ApiResponse({
        status: HttpStatus.OK,
        description: '成功查找用户',
        schema: responseSchema('ok', '成功查找用户', {
          type: 'object',
          properties: guestGetUserDtoProps,
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '用户不存在',
        schema: responseSchema('not found', '用户不存在'),
      }),
    ];
  },
  '/update-self': () => {
    return [
      ApiOperation({ summary: '更新自己的用户信息' }),
      ApiNeedAuth(),
      ApiBody({ type: UserUpdateDto }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '更新成功',
        schema: responseSchema('ok', '更新成功', {
          type: 'object',
          properties: ownerGetUserDtoProps,
        }),
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '请求参数错误，验证失败',
        schema: responseSchema('bad request', '${error.message}'),
      }),
    ];
  },
  '/upload-avatar': () => {
    return [
      ApiOperation({
        summary: '上传头像并保存',
        description:
          '上传成功后会自动设置到当前用户，图片文件最大为 5MB，每分钟限制调用 5 次',
      }),
      ApiNeedAuth(),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        type: UploadAvatarDto,
        description: '头像文件，大小不超过 5MB',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '成功上传并保存',
        schema: responseSchema('ok', '成功上传并保存'),
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: '保存失败或其他报错',
        schema: responseSchema('internal server error', '${error.message}'),
      }),
    ];
  },
});
