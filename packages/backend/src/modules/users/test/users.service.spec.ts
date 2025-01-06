import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users.module';

describe('UsersService', () => {
  let service: UsersService;
  let userId: string;
  let result: any;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongooseModule.forRoot('mongodb://localhost/quanta-frontend-challenge'),
      ],
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
    await service.remove(userId);
    await module.close();
  });

  it('should create a user', async () => {
    expect(result).toBeDefined();
    expect(result.username).toBe('test_user');
    expect(result.email).toBe('test_user@email.com');
    expect(result.number).toBe('20231003059');
    expect(result.password).toBe('password');
    expect(result.phone).toBe('13400011111');
    expect(result.role).toBe(0);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return a user', async () => {
    const result = await service.findOne(userId);
    expect(result).toBeDefined();
    expect(result.username).toBe('test_user');
    expect(result.number).toBe('20231003059');
    expect(result._id.toString()).toBe(userId);
  });

  it('should update a user', async () => {
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

  it('should increase user score', async () => {
    const result = await service.increaseUserScore(userId, 10);
    expect(result).toBeDefined();
    expect(result.totalScore).toBe(10);
  });

  it('should fail a challenge', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'failed',
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(1);
    expect(result.failedTasks).toContain('task_id');
  });

  it('should try a challenge', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'trying',
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(2);
    expect(result.tryingTasks).toContain('task_id');
    expect(result.failedTasks).not.toContain('task_id');
  });

  it('should solve a challenge', async () => {
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

  it('should remove a user', async () => {
    const result = await service.remove(userId);
    expect(result).toBeDefined();

    const user = await service.findOne(userId);
    expect(user).toBeNull();
  });

  it('should throw error when password is less than 6 characters', async () => {
    try {
      await service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'pass',
        phone: '13400011111',
      });
    } catch (error) {
      expect(error.message).toBe('密码长度不能小于6');
    }

    try {
      await service.update(userId, {
        password: 'pass',
      });
    } catch (error) {
      expect(error.message).toBe('密码长度不能小于6');
    }
  });

  it('should throw error when signature is more than 100 characters', async () => {
    try {
      await service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'password',
        phone: '13400011111',
        signature: 'a'.repeat(101),
      });
    } catch (error) {
      expect(error.message).toBe('个性签名长度不能超过100');
    }

    try {
      await service.update(userId, {
        signature: 'a'.repeat(101),
      });
    } catch (error) {
      expect(error.message).toBe('个性签名长度不能超过100');
    }
  });

  it('should throw error when phone is not 11 characters', async () => {
    try {
      await service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '20231003059',
        password: 'password',
        phone: '1340001111',
      });
    } catch (error) {
      expect(error.message).toBe('手机号长度必须是11');
    }

    try {
      await service.update(userId, {
        phone: '1340001111',
      });
    } catch (error) {
      expect(error.message).toBe('手机号长度必须是11');
    }
  });

  it('should throw error when number is not 11 characters', async () => {
    try {
      await service.create({
        username: 'test_user',
        email: 'test_user@email.com',
        number: '2023100305',
        password: 'password',
        phone: '13400011111',
      });
    } catch (error) {
      expect(error.message).toBe('学号长度必须是11');
    }

    try {
      await service.update(userId, {
        number: '2023100305',
      });
    } catch (error) {
      expect(error.message).toBe('学号长度必须是11');
    }
  });

  it('should throw error when email is invalid', async () => {
    try {
      await service.create({
        username: 'test_user',
        email: 'test_user',
        number: '20231003059',
        password: 'password',
        phone: '13400011111',
      });
    } catch (error) {
      expect(error.message).toBe('邮箱格式不正确');
    }

    try {
      await service.update(userId, {
        email: 'test_user',
      });
    } catch (error) {
      expect(error.message).toBe('邮箱格式不正确');
    }
  });
});
