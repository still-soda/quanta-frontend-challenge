import { UserSelf } from '@/models/user.model';
import { RequestResult } from '@/types/request';
import { post } from '@challenge/api';

interface LoginPayload {
   username: string;
   password: string;
}

/**
 * 登录
 */
export async function login(data: LoginPayload) {
   const result = await post<RequestResult<UserSelf>>('/auth/login', {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
   });
   if (result.data.role < 1) {
      throw new Error('权限不足');
   }
   return result;
}
