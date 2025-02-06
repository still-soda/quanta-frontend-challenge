import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../../modules/auth/auth.module';
import { AuthService } from '../../../modules/auth/auth.service';
import { UsersModule } from '../../../modules/users/users.module';
import { AuthGuard } from '../auth.guard';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import mongoose from 'mongoose';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createJwtModule } from '../../../utils/create-jwt.utils';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        mockDb.module,
        createEnvConfModule(),
        createJwtModule(),
      ],
      providers: [AuthGuard],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该正确获取中间件和服务', () => {
    expect(authGuard).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('应该正确验证用户身份', async () => {
    const username = 'test1';
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

    jest.spyOn(authGuard['reflector'], 'get').mockReturnValueOnce(true);
    jest.spyOn(authService, 'register').mockImplementation(async () => 'token');
    jest.spyOn(authService, 'verifyToken').mockImplementation(() => ({
      username,
      id: 'id',
    }));

    const token = await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });
    const req = {
      headers: { authorization: token },
      route: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
      getHandler: () => {},
    } as any;
    jest.spyOn(context, 'switchToHttp').mockReturnValue({
      getRequest: () => req,
      getResponse: () => res,
    });

    authGuard.canActivate(context);

    expect(req).toHaveProperty('user', { username, id: 'id' });
  });

  it('没有令牌应该报 401 Unauthorized', async () => {
    jest.spyOn(authGuard['reflector'], 'get').mockReturnValueOnce(true);

    const req = {
      headers: {},
      route: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
      getHandler: () => {},
    } as any;
    jest.spyOn(context, 'switchToHttp').mockReturnValue({
      getRequest: () => req,
      getResponse: () => res,
    });

    expect(() => authGuard.canActivate(context)).toThrow('需要身份令牌');
  });

  it('验证失败应该报 401 Unauthorized', async () => {
    const username = 'test2';
    const password = 'test';
    const email = 'test@test.com';
    const number = '12345678901';
    const phone = '12345678901';

    jest.spyOn(authGuard['reflector'], 'get').mockReturnValueOnce(true);
    jest.spyOn(authService, 'register').mockImplementation(async () => 'token');
    jest.spyOn(authService, 'verifyToken').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const token = await authService.register({
      username,
      password,
      email,
      number,
      phone,
    });
    const req = {
      headers: { authorization: token },
      route: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
      getHandler: () => {},
    } as any;
    jest.spyOn(context, 'switchToHttp').mockReturnValue({
      getRequest: () => req,
      getResponse: () => res,
    });

    expect(() => authGuard.canActivate(context)).toThrow('无效的身份令牌');
  });
});
