import { RequestResult } from '@/types/request';
import { post, setToken } from '@challenge/api';

/**
 * 判断请求是否成功
 * @param response 请求结果
 * @returns 是否成功
 */
function isSuccessful(response: RequestResult) {
   return response.code >= 200 && response.code < 300;
}

/**
 * 获取验证码
 * @api /auth/captcha
 * @returns 验证码信息
 */
export async function getCaptcha() {
   const response =
      await post<RequestResult<{ id: string; svg: string }>>('/auth/captcha');
   return response;
}

/**
 * 登录
 * @api /auth/login
 * @param options 登录信息
 * - `username` 用户名
 * - `password` 密码
 * @returns 登录结果
 */
export async function login(options: { username: string; password: string }) {
   const response = await post<RequestResult<{ token: string }>>(
      '/auth/login',
      { body: JSON.stringify(options) }
   );
   isSuccessful(response) && setToken(response.data.token);
   return response;
}

/**
 * 注册
 * @api /auth/register
 * @param options 注册信息
 * - `username` 用户名
 * - `password` 密码
 * - `email` 邮箱
 * - `number` 学号
 * - `captcha` 验证码
 * - `captchaId` 验证码 ID
 * @returns 注册结果
 */
export async function register(options: {
   username: string;
   password: string;
   email: string;
   number: string;
   captcha: string;
   captchaId: string;
}) {
   const response = await post<RequestResult<string>>('/auth/register', {
      body: JSON.stringify(options),
   });
   isSuccessful(response) && setToken(response.data);
   return response;
}

/**
 * 重置密码
 * @api /auth/reset-password
 * @param options 重置密码信息
 * - `username` 用户名
 * - `newPassword` 新密码
 * @returns 重置密码结果
 */
export async function resetPassword(options: {
   username: string;
   newPassword: string;
}) {
   return await post<RequestResult<boolean>>('/auth/reset-password', {
      body: JSON.stringify(options),
   });
}
