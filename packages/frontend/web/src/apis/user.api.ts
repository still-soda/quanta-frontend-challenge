import { UpdateUserPayload } from '@/dto/update-user.type';
import { User } from '@/models/user.model';
import { RequestResult } from '@/types/request';
import { get, post } from '@challenge/api';

/**
 * 获取用户信息
 * @api /users/find-one
 * @param userId 用户id
 * @returns 用户信息
 */
export async function getUserById(userId: string) {
   return await get<RequestResult<User>>(`/users/find-one`, {
      query: { userId },
   });
}

/**
 * 获取用户信息
 * @api /users/find-one
 * @param username 用户名
 * @returns 用户信息
 */
export async function getUserByUsername(username: string) {
   return await get<RequestResult<User>>(`/users/find-one`, {
      query: { username },
   });
}

/**
 * 获取自己的信息
 * @api /users/find-self
 * @returns 自己的信息
 */
export async function getSelf() {
   return await get<RequestResult<User>>(`/users/find-self`);
}

/**
 * 更新自己的信息
 * @api /users/update-self
 * @param payload 更新信息
 * @returns 更新后的用户信息
 */
export async function updateSelf(payload: UpdateUserPayload) {
   return await post<RequestResult<User>>(`/users/update-self`, {
      body: JSON.stringify(payload),
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
   return await post<RequestResult<undefined>>(`/users/upload-avatar`, {
      body: formData,
   });
}
