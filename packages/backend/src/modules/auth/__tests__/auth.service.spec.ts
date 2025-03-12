import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersModule } from '../../../modules/users/users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/db-mock.utils';
import { createEnvConfModule } from '../../../utils/env-mock.utils';
import { createJwtModule } from '../../../utils/jwt-mock.utils';
import { UsersService } from '../../users/users.service';
import mongoose from 'mongoose';
import { CachesModule } from '../../../modules/caches/caches.module';
import { CachesService } from '../../../modules/caches/caches.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let cachesService: CachesService;
  let mongodb: MongoMemoryServer;
  let module: TestingModule;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        CachesModule,
        mockDb.module,
        createEnvConfModule('.env.development'),
        createJwtModule(),
      ],
      providers: [AuthService],
    }).compile();

    await module.init();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    cachesService = module.get<CachesService>(CachesService);
  });

  afterAll(async () => {
    await module.close();
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确注册用户', async () => {
    const username = 'test1';
    const password = '___test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '13411100000';

    const token = await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });
    expect(token).not.toBeNull();

    const user = await usersService.findOneByUsername(username);
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
  });

  it('用户名重复的注册返回-1', async () => {
    const username = 'test8';
    const password = '___test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '13411100000';

    await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });

    const token = await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });

    expect(token).toBe(-1);
  });

  it('应该正确登录用户', async () => {
    const username = 'test2';
    const password = '___test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '13411100000';

    const signupToken = await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });
    expect(signupToken).not.toBeNull();

    const token = await authService.login({ username, password });
    expect(token).not.toBeNull();
  });

  it('应该正确获取用户信息', async () => {
    const username = 'test5';
    const password = '___test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '13411100000';

    const token = await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });
    expect(typeof token).toBe('string');

    const user = authService.verifyToken(token as string);
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
    expect(user.id).toBeDefined();
  });

  it('用户不存在的登录返回-1', async () => {
    const username = 'test7';
    const password = '___test';

    const result = await authService.login({ username, password });
    expect(result).toBe(-1);
  });

  it('应该正确修改密码', async () => {
    const username = 'test4';
    const password = '___test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '13411100000';

    await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });

    const newPassword = '___test2';
    const ok = await authService.resetPassword(
      { username, newPassword },
      username,
    );
    expect(ok).toBeTruthy();

    const oldToken = await authService.login({ username, password });
    expect(oldToken).toBe(-2);

    const newToken = await authService.login({
      username,
      password: newPassword,
    });
    expect(newToken).not.toBeNull();
  });

  describe('验证码测试', () => {
    it('应该正确创建验证码', async () => {
      const result = await authService.getCaptcha();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('svg');
    });

    it('应该正确验证验证码', async () => {
      const mockGet = jest
        .spyOn(cachesService, 'get')
        .mockImplementation(async () => '1234');

      const result = await authService.getCaptcha();
      expect(result.id).not.toBeNull();

      const id = result.id;
      const ok = await authService.verifyCaptcha(id, '1234');
      expect(ok).toBeTruthy();
      expect(mockGet).toHaveBeenCalledWith(`captcha:${id}`);

      mockGet.mockRestore();
    });

    it('验证码错误时验证失败', async () => {
      const result = await authService.getCaptcha();
      expect(result.id).not.toBeNull();

      const id = result.id;
      await expect(authService.verifyCaptcha(id, '4321')).rejects.toThrow(
        '验证码错误',
      );
    });

    it('验证码过期时验证失败', async () => {
      jest
        .spyOn(cachesService, 'get')
        .mockImplementationOnce(async () => '1234')
        .mockImplementationOnce(async () => null);

      const result = await authService.getCaptcha();
      expect(result.id).not.toBeNull();

      const id = result.id;
      const ok = await authService.verifyCaptcha(id, '1234');
      expect(ok).toBeTruthy();

      await expect(authService.verifyCaptcha(id, '1234')).rejects.toThrow(
        '验证码已过期',
      );
    });
  });
});
