import { SetMetadata } from '@nestjs/common';

/**
 * 限制 IP 每分钟访问次数的装饰器。
 * @param limit 限制次数，默认为 0，表示使用配置文件中的值。
 */
export const IpLimit = (limit: number = 0) => SetMetadata('ip-limit', limit);
