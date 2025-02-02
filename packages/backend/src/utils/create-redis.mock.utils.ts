import { BullModule } from '@nestjs/bull';
import Redis from 'ioredis';
import MockRedis from 'ioredis-mock';

export async function createMockRedisModule() {
  const redis: Redis = new MockRedis();
  const module = BullModule.forRoot({ redis: redis.options });
  return { redis, module };
}
