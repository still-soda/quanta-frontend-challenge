import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { UsersModule } from '../../../modules/users/users.module';
import { AuthModule } from '../auth.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createJwtModule } from '../../../utils/create-jwt.utils';
import mongoose from 'mongoose';
import { AuthService } from '../auth.service';
import { ROLE } from '../../../common/decorators/auth.decorator';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    const mockDb = await createMockDBModule();
    mongodb = mockDb.mongodb;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mockDb.module,
        UsersModule,
        AuthModule,
        createEnvConfModule(),
        createJwtModule(),
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  describe('login', () => {
    it('应该在登录时返回令牌', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => 'token');

      const result = await authController.login({
        username: 'test',
        password: 'test',
      });

      expect(result.code).toBe(200);
      expect(result.message).toBe('登录成功');
      expect(result.data).toHaveProperty('token', 'token');
    });

    it('应该在登录时返回用户不存在', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => -1);

      const result = authController.login({
        username: 'test',
        password: 'test',
      });

      await expect(result).rejects.toThrow('用户不存在');
    });

    it('应该在登录时返回密码错误', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => -2);

      const result = authController.login({
        username: 'test',
        password: 'test',
      });

      await expect(result).rejects.toThrow('密码错误');
    });

    it('应该在登录时返回请求参数错误', async () => {
      jest.spyOn(authController, 'login').mockImplementationOnce(async () => {
        throw new Error('请求参数错误');
      });

      const result = authController.login({
        username: 'test',
        password: 'test',
      });

      await expect(result).rejects.toThrow('请求参数错误');
    });
  });

  describe('register', () => {
    it('应该在注册时返回令牌', async () => {
      jest
        .spyOn(authService, 'register')
        .mockImplementation(async () => 'token');

      const result = await authController.register({
        username: 'test',
        password: 'test',
        email: 'test@email.com',
        number: '12345678901',
        phone: '12345678901',
      });

      expect(result.code).toBe(200);
      expect(result.message).toBe('注册成功');
      expect(result.data).toHaveProperty('token', 'token');
    });

    it('应该在注册时返回用户名重复', async () => {
      jest.spyOn(authService, 'register').mockImplementation(async () => -1);

      const result = authController.register({
        username: 'test',
        password: 'test',
        email: 'test@email.com',
        number: '12345678901',
        phone: '12345678901',
      });

      await expect(result).rejects.toThrow('用户名重复');
    });

    it('应该在注册时返回请求参数错误', async () => {
      jest
        .spyOn(authController, 'register')
        .mockImplementationOnce(async () => {
          throw new Error('请求参数错误');
        });

      const result = authController.register({
        username: 'test',
        password: 'test',
        email: 'test@email.com',
        number: '12345678901',
        phone: '12345678901',
      });

      await expect(result).rejects.toThrow('请求参数错误');
    });
  });

  describe('resetPassword', () => {
    it('应该在重置密码时返回成功', async () => {
      jest
        .spyOn(authService, 'resetPassword')
        .mockImplementation(async () => true);

      const result = await authController.resetPassword(
        { username: 'test', newPassword: 'test' },
        { username: 'test', id: 'test', role: ROLE.USER },
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe('重置成功');
    });

    it('应该在重置密码时返回请求参数错误', async () => {
      jest
        .spyOn(authController, 'resetPassword')
        .mockImplementationOnce(async () => {
          throw new Error('请求参数错误');
        });

      const result = authController.resetPassword(
        { username: 'test', newPassword: 'test' },
        { username: 'test', id: 'test', role: ROLE.USER },
      );

      await expect(result).rejects.toThrow('请求参数错误');
    });

    it('应该在重置密码时返回用户不存在', async () => {
      jest
        .spyOn(authService, 'resetPassword')
        .mockImplementation(async () => false);

      const result = authController.resetPassword(
        { username: 'test', newPassword: 'test' },
        { username: 'test', id: 'test', role: ROLE.USER },
      );

      await expect(result).rejects.toThrow('用户不存在');
    });
  });
});
