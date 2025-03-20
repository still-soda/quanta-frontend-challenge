import { ACCOUNT, Role, Token } from '../constants';

/**
 * 检测是否不是管理员
 */
export function notAdmin(headers: any) {
   try {
      const { authorization } = headers;
      if (
         authorization !== Token.ADMIN &&
         authorization !== Token.SUPER_ADMIN
      ) {
         return true;
      }
   } catch (error) {
      return false;
   }
}

/**
 * 检测是否不是超级管理员
 */
export function notSuperAdmin(headers: any) {
   try {
      const { authorization } = headers;
      if (authorization !== Token.SUPER_ADMIN) {
         return true;
      }
   } catch (error) {
      return false;
   }
}

/**
 * 检测是否不是用户
 */
export function notUser(headers: any) {
   try {
      const { authorization } = headers;
      if (authorization !== Token.USER) {
         return true;
      }
   } catch (error) {
      return false;
   }
}

/**
 * 检测身份
 */
export function checkRole(body: any): Role | null {
   try {
      const { username, password } = body;

      const check = (account: { username: string; password: string }) => {
         return username === account.username && password === account.password;
      };

      if (check(ACCOUNT.ADMIN)) {
         return Role.ADMIN;
      }

      if (check(ACCOUNT.SUPER_ADMIN)) {
         return Role.SUPER_ADMIN;
      }

      if (check(ACCOUNT.USER)) {
         return Role.USER;
      }
   } catch (error) {
      return null;
   }

   return null;
}
