import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('App 测试', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('应该启动成功', () => {
    expect(module).toBeDefined();
  });

  it.todo('验证用户正常使用流程');
});
