import { Test, TestingModule } from '@nestjs/testing';
import { CachesService } from '../caches.service';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';

describe('CachesService', () => {
  let cachesService: CachesService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [createEnvConfModule('.env.development')],
      providers: [CachesService],
    }).compile();

    await module.init();

    cachesService = module.get<CachesService>(CachesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('应该正确获取服务', () => {
    expect(cachesService).toBeDefined();
  });

  it('应该正确设置和获取缓存', async () => {
    const key = 'test-key';
    const value = 'test-value';
    const ttl = 10;
    await cachesService.set(key, value, ttl);
    const result = await cachesService.get(key);
    expect(result).toBe(value);
  });

  it('应该正确删除缓存', async () => {
    const key = 'test-key-1';
    const value = 'test-value';
    const ttl = 10;
    await cachesService.set(key, value, ttl);
    await cachesService.del(key);
    const result = await cachesService.get(key);
    expect(result).toBeNull();
  });

  it('应该正确获取缓存 TTL', async () => {
    const key = 'test-key-2';
    const value = 'test-value';
    const ttl = 10;
    await cachesService.set(key, value, ttl);
    const result = await cachesService.ttl(key);
    expect(result).toBeLessThanOrEqual(ttl);
  });

  it('应该正确设置缓存过期时间', async () => {
    const key = 'test-key-3';
    const value = 'test-value';
    const ttl = 5;
    await cachesService.set(key, value, ttl);
    const newTtl = 10;
    await cachesService.expire(key, newTtl);
    const result = await cachesService.ttl(key);
    expect(result).toBeLessThanOrEqual(newTtl);
  });
});
