import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { MongooseModule } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/quanta-frontend-challenge'),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let userId: string;

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'test_user',
      email: 'test_user@email.com',
      number: '20231003059',
      password: 'password',
      phone: '13400011111',
    };
    const result = await service.create(createUserDto);
    expect(result).toBeDefined();
    expect(result.username).toBe('test_user');
    expect(result.email).toBe('test_user@email.com');
    expect(result.number).toBe('20231003059');
    expect(result.password).toBe('password');
    expect(result.phone).toBe('13400011111');

    userId = result._id as string;
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
    expect(result._id).toBe(userId);
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
    expect(result.totalSubmissions).toBe(2);
    expect(result.failedTasks).toContain('task_id');
  });

  it('should try a challenge', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'trying',
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(3);
    expect(result.tryingTasks).toContain('task_id');
    expect(result.failedTasks).not.toContain('task_id');
  });

  it('should solve a challenge', async () => {
    const result = await service.submitChallenge(userId, 'task_id', {
      status: 'success',
      score: 10,
    });
    expect(result).toBeDefined();
    expect(result.totalSubmissions).toBe(1);
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
});
