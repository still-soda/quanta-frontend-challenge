import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CachesService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;
  private readonly REDIS_HOST: string;
  private readonly REDIS_PORT: number;
  private readonly REDIS_PREFIX = 'challenge:';

  constructor(private readonly configService: ConfigService) {
    this.REDIS_HOST = this.configService.getOrThrow<string>('REDIS_HOST');
    this.REDIS_PORT = this.configService.getOrThrow<number>('REDIS_PORT');
  }

  onModuleInit() {
    this.redis = new Redis({
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
      keyPrefix: this.REDIS_PREFIX,
    });
  }

  onModuleDestroy() {
    this.redis?.disconnect();
  }

  /**
   * 获取缓存数据。
   * @param key 缓存键
   * @returns 缓存值
   */
  async get(key: string) {
    return this.redis.get(key);
  }

  /**
   * 设置缓存数据。
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 缓存过期时间
   */
  async set(key: string, value: string, ttl: number) {
    return this.redis.set(key, value, 'EX', ttl);
  }

  /**
   * 删除缓存数据。
   * @param key 缓存键
   */
  async del(key: string) {
    return this.redis.del(key);
  }

  /**
   * 自增缓存数据。
   * @param key 缓存键
   */
  async incr(key: string) {
    return this.redis.incr(key);
  }

  /**
   * 设置缓存过期时间。
   * @param key 缓存键
   * @param ttl 过期时间
   */
  async expire(key: string, ttl: number) {
    return this.redis.expire(key, ttl);
  }

  /**
   * 获取缓存过期时间。
   * @param key 缓存键
   */
  async ttl(key: string) {
    return this.redis.ttl(key);
  }
}
