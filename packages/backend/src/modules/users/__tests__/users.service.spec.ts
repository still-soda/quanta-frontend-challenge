import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userId: string;
  let result: any;
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, MongooseModule.forRoot(uri)],
      providers: [UsersService, UsersModule],
    }).compile();

    service = module.get<UsersService>(UsersService);

    const createUserDto: CreateUserDto = {
      username: 'test_user',
      email: 'test_user@email.com',
      number: '20231003059',
      password: 'password',
      phone: '13400011111',
    };
    result = await service.create(createUserDto);
    userId = result._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('应该创建一个用户', async () => {
    expect(result).toBeDefined();
    expect(result.username).toBe('test_user');
    expect(result.email).toBe('test_user@email.com');
    expect(result.number).toBe('20231003059');
    expect(result.password).toBe('password');
    expect(result.phone).toBe('13400011111');
    expect(result.role).toBe(0);
  });

  it('应该返回所有用户', async () => {
    const result = await service.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('应该返回一个用户', async () => {
    const result = await service.findOne(userId);
    expect(result).toBeDefined();
    expect(result.username).toBe('test_user');
    expect(result.number).toBe('20231003059');
    expect(result._id.toString()).toBe(userId);
  });

  it('应该更新一个用户', async () => {
    const result = await service.update(userId, {
      username: 'test_user_updated',
      email: 'test_user_updated@email.com',
      avatarUrl: 'https://test.com/avatar.jpg',
    });
    expect(result).toBeDefined();
    expect(result.username).toBe('test_user_updated');
    expect(result.email).toBe('test_user_updated@email.com');
    expect(result.avatarUrl).toBe('https://test.com/avatar.jpg');
  });

  it('应该增加用户积分', async () => {
    const result = await service.increaseUserScore(userId, 10);
    expect(result).toBeDefined();
    expect(result.totalScore).toBe(10);
  });

  it('应该失败一个挑战', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'failed',
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(1);
    expect(result.failedTasks).toContain('task_id');
  });

  it('应该尝试一个挑战', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'trying',
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(2);
    expect(result.tryingTasks).toContain('task_id');
    expect(result.failedTasks).not.toContain('task_id');
  });

  it('应该解决一个挑战', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'success',
      score: 10,
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(3);
    expect(result.totalScore).toBe(20);
    expect(result.solvedTasks).toContain('task_id');
    expect(result.failedTasks).not.toContain('task_id');
    expect(result.tryingTasks).not.toContain('task_id');
  });

  it('应该删除一个用户', async () => {
    const result = await service.remove(userId);
    expect(result).toBeDefined();

    const user = await service.findOne(userId);
    expect(user).toBeNull();
  });

  it('密码长度小于6字符时应该抛出错误（create）', async () => {
    await expect(
      service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'pass',
        phone: '13400011111',
      }),
    ).rejects.toThrow('密码长度不能小于6');
  });

  it('密码长度小于6字符时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        password: 'pass',
      }),
    ).rejects.toThrow('密码长度不能小于6');
  });

  it('个性签名长度超过100字符时应该抛出错误（create）', async () => {
    await expect(
      service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'password',
        phone: '13400011111',
        signature: 'a'.repeat(101),
      }),
    ).rejects.toThrow('个性签名长度不能超过100');
  });

  it('个性签名长度超过100字符时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        signature: 'a'.repeat(101),
      }),
    ).rejects.toThrow('个性签名长度不能超过100');
  });

  it('手机号长度不是11字符时应该抛出错误（create）', async () => {
    await expect(
      service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'password',
        phone: '1340001111',
      }),
    ).rejects.toThrow('手机号长度必须是11');
  });

  it('手机号长度不是11字符时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        phone: '1340001111',
      }),
    ).rejects.toThrow('手机号长度必须是11');
  });

  it('学号长度不是11字符时应该抛出错误（create）', async () => {
    expect(
      service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '2023100305',
        password: 'password',
        phone: '13400011111',
      }),
    ).rejects.toThrow('学号长度必须是11');
  });

  it('学号长度不是11字符时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        number: '2023100305',
      }),
    ).rejects.toThrow('学号长度必须是11');
  });

  it('邮箱格式不正确时应该抛出错误（create）', async () => {
    await expect(
      service.create({
        username: 'test_user',
        email: 'test_user',
        number: '20231003059',
        password: 'password',
        phone: '13400011111',
      }),
    ).rejects.toThrow('邮箱格式不正确');
  });

  it('邮箱格式不正确时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        email: 'test_user',
      }),
    ).rejects.toThrow('邮箱格式不正确');
  });

  it('用户名长度小于1字符时应该抛出错误（create）', async () => {
    await expect(
      service.create({
        username: '',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'password',
        phone: '13400011111',
      }),
    ).rejects.toThrow('用户名长度必须在1到20之间');
  });

  it('用户名长度小于1字符时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        username: '',
      }),
    ).rejects.toThrow('用户名长度必须在1到20之间');
  });

  it('角色不是0或1时应该抛出错误（create）', async () => {
    await expect(
      service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'password',
        phone: '13400011111',
        role: 2,
      }),
    ).rejects.toThrow('角色只能是0或1');
  });

  it('角色不是0或1时应该抛出错误（update）', async () => {
    await expect(
      service.update(userId, {
        role: 2,
      }),
    ).rejects.toThrow('角色只能是0或1');
  });

  it('不应该更新不在UpdateUserDto中的字段', async () => {
    const created = await service.create({
      username: 'test_user',
      email: 'test_user@email.com',
      number: '20231003059',
      password: 'password',
      phone: '13400011111',
    } as any);
    const updated = await service.update(created._id.toString(), {
      tryingTasks: ['task_id'],
      failedTasks: ['task_id'],
      solvedTasks: ['task_id'],
    } as any);
    expect(updated.tryingTasks).toHaveLength(0);
    expect(updated.failedTasks).toHaveLength(0);
    expect(updated.solvedTasks).toHaveLength(0);
  });

  it('创建用户时不应该初始化不在CreateUserDto中的字段', async () => {
    const result = await service.create({
      username: 'test_user',
      email: 'test_user@email.com',
      number: '20231003059',
      password: 'password',
      phone: '13400011111',
      tryingTasks: ['task_id'],
      failedTasks: ['task_id'],
      solvedTasks: ['task_id'],
    } as any);
    expect(result.tryingTasks).toHaveLength(0);
    expect(result.failedTasks).toHaveLength(0);
    expect(result.solvedTasks).toHaveLength(0);
  });
});
