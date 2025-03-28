import { MockMethod } from './types';
import { AuthApi } from '../apis';
import { POST, Role, CAPTCAH_SVG, Token } from './constants';
import { response } from './utils/response.utils';
import { mock } from 'mockjs';
import { checkRole } from './utils/check.utils';

export default [
   {
      url: AuthApi.GET_CAPTCHA,
      method: POST,
      response: () =>
         response(
            'ok',
            { id: mock('@id'), svg: CAPTCAH_SVG },
            'Mock: 获取成功'
         ),
   },
   {
      url: AuthApi.LOGIN,
      method: POST,
      response: ({ body }: any) => {
         const role = checkRole(body);
         if (!role) return response('bad request', null, 'Mock: 请求错误');

         if (role === Role.ADMIN) {
            return response('ok', { token: Token.ADMIN }, 'Mock: 登录成功');
         }

         if (role === Role.SUPER_ADMIN) {
            return response(
               'ok',
               { token: Token.SUPER_ADMIN },
               'Mock: 登录成功'
            );
         }

         return response('ok', { token: Token.USER }, 'Mock: 登录成功');
      },
   },
   {
      url: AuthApi.REGISTER,
      method: POST,
      response: () => response('ok', { token: Token.USER }, 'Mock: 注册成功'),
   },
   {
      url: AuthApi.RESET_PASSWORD,
      method: POST,
      response: () => response('ok', null, 'Mock: 重置成功'),
   },
] satisfies MockMethod[];
