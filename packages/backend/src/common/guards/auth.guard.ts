import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { responseError } from '../../utils/http-response.utils';

/**
 * 验证用户身份令牌的守卫，需要在控制器方法上添加 `@Auth()` 装饰器。
 *
 * 验证成功后，会将用户信息添加到请求对象的 `user` 属性上。
 *
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
    const token: string = req.headers['authorization'];

    if (!token) {
      throw responseError('unauthorized', { msg: '需要身份令牌' });
    }

    let user: { username: string; id: string };
    try {
      user = this.authService.verifyToken(token);
    } catch (error) {
      throw responseError('unauthorized', { msg: '无效的身份令牌' });
    }

    req.user = user;
    return true;
  }
}
