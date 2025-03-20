import { UpdateUserDto } from '../dtos/update-user.dto';
import { User, UserSelf } from '../models';
import { RequestResult } from '../utils/request.types';
import { get, post } from '../utils/request.utils';

export enum UserApi {
   GET_USER_BY_ID = '/users/find-one',
   GET_USER_BY_USERNAME = '/users/find-one',
   GET_SELF = '/users/find-self',
   UPDATE_SELF = '/users/update-self',
   UPLOAD_AVATAR = '/users/upload-avatar',
   GET_DEFAULT_AVATAR = '/users/get-default-avatar/',
}

/**
 * 获取用户信息
 * @api /users/find-one
 * @param id 用户id
 * @returns 用户信息
 */
export async function getUserById(id: string) {
   return await get<RequestResult<User>>(UserApi.GET_USER_BY_ID, {
      query: { id },
   });
}

/**
 * 获取用户信息
 * @api /users/find-one
 * @param username 用户名
 * @returns 用户信息
 */
export async function getUserByUsername(username: string) {
   return await get<RequestResult<User>>(UserApi.GET_USER_BY_USERNAME, {
      query: { username },
   });
}

/**
 * 获取自己的信息
 * @api /users/find-self
 * @returns 自己的信息
 */
export async function getSelf() {
   return await get<RequestResult<UserSelf>>(UserApi.GET_SELF);
}

/**
 * 更新自己的信息
 * @api /users/update-self
 * @param payload 更新信息
 * @returns 更新后的用户信息
 */
export async function updateSelf(payload: UpdateUserDto) {
   return await post<RequestResult<User>>(UserApi.UPDATE_SELF, {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
   });
}

/**
 * 上传头像
 * @api /users/upload-avatar
 * @param file 头像文件
 * @returns 头像地址
 */
export async function uploadAvatar(file: File) {
   const formData = new FormData();
   formData.append('file', file);
   return await post<RequestResult<undefined>>(UserApi.UPLOAD_AVATAR, {
      body: formData,
   });
}

/**
 * 获取默认头像
 * @api /users/default-avatar
 * @param id 用户id，不传则自己的默认头像
 * @returns 默认头像地址
 */
export async function getDefaultAvatar(id: string) {
   return await get<RequestResult<{ avatar: string }>>(
      `${UserApi.GET_DEFAULT_AVATAR}${id}`
   );
}
