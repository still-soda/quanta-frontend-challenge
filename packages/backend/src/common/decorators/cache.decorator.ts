import { SetMetadata } from '@nestjs/common';

/**
 * 为当前接口启用缓存，缓存时间由环境变量 `CACHE_TTL` 控制，默认 60 秒。
 *
 * 可以通过 `UseCache(ttl)` 来设置缓存时间，单位秒。
 *
 * @param ttl 缓存时间，单位秒，不传则使用环境变量 `CACHE_TTL` 的值
 */
export const UseCache = (ttl: number = 0) => SetMetadata('use-cache', ttl);
