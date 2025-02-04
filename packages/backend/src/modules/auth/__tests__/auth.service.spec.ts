import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersModule } from '../../../modules/users/users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createJwtModule } from '../../../utils/create-jwt.utils';
import { UsersService } from '../../users/users.service';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        mockDb.module,
        createEnvConfModule(),
        createJwtModule(),
      ],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确注册用户', async () => {
    const username = 'test1';
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

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
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

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
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

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
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

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
    const password = 'test';

    const result = await authService.login({ username, password });
    expect(result).toBe(-1);
  });

  it('应该正确修改密码', async () => {
    const username = 'test4';
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

    await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });

    const newPassword = 'test2';
    const ok = await authService.resetPassword({
      username,
      newPassword,
    });
    expect(ok).toBeTruthy();

    const oldToken = await authService.login({ username, password });
    expect(oldToken).toBe(-2);

    const newToken = await authService.login({
      username,
      password: newPassword,
    });
    expect(newToken).not.toBeNull();
  });
});
