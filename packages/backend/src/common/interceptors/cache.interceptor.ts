import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { of, tap } from 'rxjs';
import { CachesService } from 'src/modules/caches/caches.service';
import { ConfigService } from '@nestjs/config';

interface Response {
  code: number;
  message: string;
  data: any;
}

/**
 * 生成哈希值
 * @param str 字符串
 * @returns 哈希值
 */
function generateHash(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * 缓存拦截器，用于缓存请求响应，默认缓存时间 60 秒。
 *
 * 配合装饰器 `@UseCache()` 使用。
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly ttl = this.configService.get<number>('CACHE_TTL') ?? 60;

  constructor(
    private readonly reflector: Reflector,
    private readonly cachesService: CachesService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const useCache = this.reflector.get<boolean>(
      'use-cache',
      context.getHandler(),
    );

    if (!useCache) {
      return next.handle();
    }

    // 生成缓存 key（由请求各部分的哈希构成）
    const request: Request = context.switchToHttp().getRequest();
    const hashBody = [
      request.url,
      JSON.stringify(request.body),
      JSON.stringify(request.query),
      JSON.stringify(request.params),
      request.headers['authorization'] ?? '',
    ].join(';');

    const key = `cache:${generateHash(hashBody)}`;

    const cacheResponse = await this.cachesService.get(key);
    if (cacheResponse) {
      return of(JSON.parse(cacheResponse));
    }

    return next.handle().pipe(
      tap((response: Response) => {
        // 发生错误时不缓存
        if (response.code && response.code >= 400) {
          return;
        }
        const json = JSON.stringify(response);
        this.cachesService.set(key, json, this.ttl);
      }),
    );
  }
}
