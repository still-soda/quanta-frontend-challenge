import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMockDBModule } from '../../../utils/create-db.mock.utils';
import { UsersModule } from '../../../modules/users/users.module';
import { AuthModule } from '../auth.module';
import { createEnvConfModule } from '../../../utils/create-env-conf.utils';
import { createJwtModule } from '../../../utils/create-jwt.utils';
import validateData from '../../../utils/validate-data.utils';
import mongoose from 'mongoose';
import { AuthService } from '../auth.service';

jest.mock('../../../utils/validate-data.utils');

const mockValidateData = validateData as jest.MockedFunction<
  typeof validateData
>;

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

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

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

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

      const result = authController.login({
        username: 'test',
        password: 'test',
      });

      await expect(result).rejects.toThrow('用户不存在');
    });

    it('应该在登录时返回密码错误', async () => {
      jest.spyOn(authService, 'login').mockImplementation(async () => -2);

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

      const result = authController.login({
        username: 'test',
        password: 'test',
      });

      await expect(result).rejects.toThrow('密码错误');
    });

    it('应该在登录时返回请求参数错误', async () => {
      mockValidateData.mockImplementationOnce(() => {
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

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

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

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

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
      mockValidateData.mockImplementationOnce(() => {
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

    it('应该在注册时返回请求参数错误', async () => {
      mockValidateData.mockImplementationOnce(() => {
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

    it('应该在注册时返回请求参数错误', async () => {
      mockValidateData.mockImplementationOnce(() => {
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

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

      const result = await authController.resetPassword({
        username: 'test',
        newPassword: 'test',
        user: { username: 'test', id: 'test' },
      });

      expect(result.code).toBe(200);
      expect(result.message).toBe('重置成功');
    });

    it('应该在重置密码时返回请求参数错误', async () => {
      mockValidateData.mockImplementationOnce(() => {
        throw new Error('请求参数错误');
      });

      const result = authController.resetPassword({
        username: 'test',
        newPassword: 'test',
        user: { username: 'test', id: 'test' },
      });

      await expect(result).rejects.toThrow('请求参数错误');
    });

    it('应该在验证得到的用户信息与请求的用户信息不一致时返回无权限', async () => {
      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

      const result = authController.resetPassword({
        username: 'test',
        newPassword: 'test',
        user: { username: 'test2', id: 'test' },
      });

      await expect(result).rejects.toThrow('无权限');
    });

    it('应该在重置密码时返回用户不存在', async () => {
      jest
        .spyOn(authService, 'resetPassword')
        .mockImplementation(async () => false);

      mockValidateData.mockImplementationOnce((_, data) =>
        Promise.resolve(data),
      );

      const result = authController.resetPassword({
        username: 'test',
        newPassword: 'test',
        user: { username: 'test', id: 'test' },
      });

      await expect(result).rejects.toThrow('用户不存在');
    });
  });
});
