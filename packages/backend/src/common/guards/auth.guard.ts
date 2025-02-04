import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';

/**
 * 用户信息接口，用于被 `@Auth()` 装饰器标记的路由.
 *
 * 当用户验证成功后，验证守卫会将用户信息存储在请求体中。
 *
 * - `user` 用户信息
 *    - `username` 用户名
 *    - `id` 用户 ID
 */
export interface UserInfo {
  user: { username: string; id: string };
}

/**
 * 验证用户身份令牌的守卫。
 * @throws
 * - `401`: 需要身份令牌
 * - `401`: 无效的身份令牌
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requireAuth = this.reflector.get<boolean>(
      'require-auth',
      context.getHandler(),
    );

    if (!requireAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const token: string = req.headers['authorization'];

    if (!token) {
      res.status(401).json({ message: '需要身份令牌' });
      return false;
    }

    let user: { username: string; id: string };
    try {
      user = this.authService.verifyToken(token);
    } catch (error) {
      res.status(401).json({ message: '无效的身份令牌' });
      return false;
    }

    !req.body && (req.body = {});
    req.body.user = user;
    return true;
  }
}
