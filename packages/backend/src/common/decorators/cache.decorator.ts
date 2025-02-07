import { SetMetadata } from '@nestjs/common';

/**
 * 为当前接口启用缓存，缓存时间由环境变量 `CACHE_TTL` 控制，默认 60 秒。
 */
export const UseCache = () => SetMetadata('use-cache', true);
