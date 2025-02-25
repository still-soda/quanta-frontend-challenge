import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CachesService } from '../../modules/caches/caches.service';
import { responseError } from '../../utils/http-response.utils';

/**
 * IP 限制守卫，用于限制同一 IP 的请求频率。
 *
 * 通过在控制器方法上添加 `@IpLimit()` 装饰器来启用 IP 限制。
 *
 * @throws
 * - `400` 无法获取 IP 地址
 * - `429` 请求过于频繁
 */
@Injectable()
export class IpLimitGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly cachesService: CachesService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const ipLimit = this.reflector.get<number>(
      'ip-limit',
      context.getHandler(),
    );

    if (ipLimit === undefined) {
      return true;
    }

    const ip =
      request.headers?.['x-real-ip'] ||
      request.headers?.['x-forwarded-for'] ||
      request.socket?.remoteAddress ||
      (request as any).ip;

    if (!ip) {
      throw responseError('bad request', { msg: '无法获取 IP 地址' });
    }

    const limit =
      ipLimit === 0
        ? this.configService.get<number>('IP_LIMIT') || 10
        : ipLimit;
    const key = `ip-limit:${ip}`;
    const count = await this.cachesService.incr(key);

    if (count === 1) {
      await this.cachesService.expire(key, 60);
    }

    if (count > limit) {
      throw responseError('too many requests', {
        msg: '请求过于频繁，请稍后再试',
      });
    }

    return true;
  }
}
