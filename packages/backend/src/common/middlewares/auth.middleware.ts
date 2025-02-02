import { Injectable, NestMiddleware } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';

/**
 * 验证用户身份令牌的中间件。
 *
 * **需要在路由上添加 `@RequireAuth()` 装饰器。**
 *
 * 在确定需要认证后，会从请求头中获取 `Authorization` 字段，如果不存在，
 * 则返回 401 状态码；如果存在则验证身份令牌，如果验证失败则返回 401 状态码。
 *
 * **验证成功则将用户信息存储在请求体中。**
 * @throws
 * - `401`: 需要身份令牌
 * - `401`: 无效的身份令牌
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requireAuth = this.reflector.get<boolean>('require-auth', req.route);
    if (!requireAuth) {
      return next();
    }

    const token: string = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ message: '需要身份令牌' });
    }

    let user: { username: string; id: string };
    try {
      user = this.authService.verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: '无效的身份令牌' });
    }

    req.body.user = user;
    next();
  }
}
