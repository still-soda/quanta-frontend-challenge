import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { AssetsService } from '../../assets/assets.service';
import { convertNameToUuid } from '../../../utils/rename.utils';
import { ConfigModule } from '@nestjs/config';

describe('TasksService', () => {
  let tasksService: TasksService;
  let assetsServiceSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),
      ],
      providers: [TasksService, AssetsService],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);

    const assetsService = module.get<AssetsService>(AssetsService);
    assetsServiceSpy = jest
      .spyOn(assetsService, 'saveTextFile')
      .mockImplementation((_, name) => {
        return Promise.resolve({ ok: true, fileName: convertNameToUuid(name) });
      });
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  // 应该正确序列化流程文件
  it('should serialize flow data and save correctly', async () => {
    const challengeId = 'test_challenge_id';
    const flowDataDto = {
      flowData: [
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
        { type: 'testpoint', detail: { name: '测试', score: 20 } },
      ],
    };

    const result = await tasksService.serializeFlowData(
      challengeId,
      flowDataDto as any,
    );
    expect(assetsServiceSpy).toHaveBeenCalled();
    expect(result).toBe(`${challengeId}.json`);
  });
});
