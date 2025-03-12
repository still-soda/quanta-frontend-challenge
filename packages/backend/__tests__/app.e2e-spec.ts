import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';

const SUPER_ADMIN = {
  username: 'test-user',
  password: '123456',
};

const USER = {
  username: 'user-test',
  password: '123456',
};

describe('App 测试', () => {
  let module: TestingModule;
  let app: INestApplication;
  let GET: (url: string) => request.Test;
  let POST: (url: string) => request.Test;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    GET = (url: string) => request(app.getHttpServer()).get(url);
    POST = (url: string) => request(app.getHttpServer()).post(url);
  });

  afterAll(async () => {
    await app.close();
    await module.close();
    await mongoose.disconnect();
  });

  it('应该启动成功', () => {
    expect(module).toBeDefined();
  });

  test('验证用户正常使用流程', async () => {
    // ------------------- 管理员行为 -------------------
    // 登录管理员
    const superAdminLoginRes = await POST('/auth/login')
      .send(SUPER_ADMIN)
      .then((res) => res.body);
    expect(superAdminLoginRes.code).toBe(200);
    expect(superAdminLoginRes.data).toBeDefined();
    expect(superAdminLoginRes.data).toHaveProperty('token');
    const superAdminToken = superAdminLoginRes.data.token;
    console.log('管理员：登录成功');

    // 创建挑战
    const challenge1 = await POST('/challenges/create')
      .set('authorization', superAdminToken)
      .send({
        title: '测试挑战',
        difficulty: 'eazy',
        score: 100,
        content: '### 这是测试内容',
        type: 'css',
        tags: ['css', 'html'],
      })
      .then((res) => res.body);
    expect(challenge1.code).toBe(200);
    expect(challenge1.data).toBeDefined();
    expect(challenge1.data).toHaveProperty('title', '测试挑战');
    console.log('管理员：创建挑战成功');

    // 修改挑战标题
    const challenge2 = await POST(`/challenges/update/${challenge1.data.id}`)
      .set('authorization', superAdminToken)
      .send({
        title: '测试挑战2',
      })
      .then((res) => res.body);
    expect(challenge2.code).toBe(200);
    expect(challenge2.data).toBeDefined();
    expect(challenge2.data).toHaveProperty('title', '测试挑战2');
    console.log('管理员：修改挑战标题成功');

    // 上传标准答案
    const stdAnswer: string = fs.readFileSync(
      path.resolve(__dirname, 'test-files/index.html'),
      'utf-8',
    );
    const stdAnswerRes = await POST(`/challenges/upload-standard-answer`)
      .set('authorization', superAdminToken)
      .send({
        challengeId: challenge2.data.id,
        content: stdAnswer,
      })
      .then((res) => res.body);
    expect(stdAnswerRes.code).toBe(200);
    expect(stdAnswerRes.data).toBeDefined();
    expect(stdAnswerRes.data).toHaveProperty('standardAnswer');
    expect(stdAnswerRes.data.standardAnswer).toHaveLength(1);
    console.log('管理员：上传标准答案成功');

    // 上传作答模板
    const templateFile: Buffer = fs.readFileSync(
      path.resolve(__dirname, 'test-files/answer-template.html'),
    );
    const uploadTemplateRes = await POST(`/challenges/upload-answer-templates`)
      .set('authorization', superAdminToken)
      .attach('answerTemplates', templateFile, 'answer-template.html')
      .field('challengeId', challenge2.data.id)
      .then((res) => res.body);
    expect(uploadTemplateRes.code).toBe(200);
    console.log('管理员：上传作答模板成功');

    // 上传判题流程
    const flow = [
      {
        type: 'testpoint',
        detail: {
          name: 'h1文字测试',
          score: 100,
          selector: 'h1',
          type: 'expect',
          text: 'Hello World',
        },
      },
    ];
    const uploadFlowDataResult = await POST(`/tasks/upload-flow-data`)
      .set('authorization', superAdminToken)
      .send({
        challengeId: challenge2.data.id,
        data: JSON.stringify(flow),
      })
      .then((res) => res.body);
    expect(uploadFlowDataResult.code).toBe(200);
    console.log('管理员：上传判题流程成功');

    // 启动预执行
    const preExecuteRes = await POST(`/tasks/launch-pre-execute`)
      .set('authorization', superAdminToken)
      .send({
        challengeId: challenge2.data.id,
      })
      .then((res) => res.body);
    expect(preExecuteRes.code).toBe(201);
    expect(preExecuteRes.data).toBeDefined();
    expect(preExecuteRes.data).toHaveProperty('submissionId');
    console.log('管理员：启动预执行成功');

    // 等待 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 获取预执行结果
    const preExecuteResult = await GET(`/submissions/one-submission`)
      .set('authorization', superAdminToken)
      .query({ submissionId: preExecuteRes.data.submissionId })
      .then((res) => res.body);
    expect(preExecuteResult.code).toBe(200);
    expect(preExecuteResult.data).toBeDefined();
    expect(preExecuteResult.data).toHaveProperty('status', 'passed');
    console.log('管理员：获取预执行结果成功');

    // 发布挑战
    const publishRes = await POST(`/challenges/switch-status`)
      .set('authorization', superAdminToken)
      .send({
        id: challenge2.data.id,
        status: 2,
      })
      .then((res) => res.body);
    expect(publishRes.code).toBe(200);
    console.log('管理员：发布挑战成功');

    // ------------------- 用户行为 -------------------
    // 用户登录
    const userLoginRes = await POST('/auth/login')
      .send(USER)
      .then((res) => res.body);
    expect(userLoginRes.code).toBe(200);
    expect(userLoginRes.data.token).toBeDefined();
    const userToken = userLoginRes.data.token;
    console.log('用户：登录成功');

    // 获取最新挑战
    const latestChallenge = await GET('/challenges/get-latest-challenges');
    expect(latestChallenge.body.code).toBe(200);
    expect(latestChallenge.body.data).toBeDefined();
    expect(latestChallenge.body.data.length).toBeGreaterThan(1);
    console.log('用户：获取最新挑战成功');

    // 获取挑战详情
    const challengeDetail = await GET(
      `/challenges/detail/${challenge2.data.id}`,
    ).then((res) => res.body);
    expect(challengeDetail.code).toBe(200);
    expect(challengeDetail.data).toBe('### 这是测试内容');
    console.log('用户：获取挑战详情成功');

    // 获取作答模板的下载地址
    const downloadTemplateRes = await GET(
      `/challenges/download-answer-template`,
    )
      .set('authorization', userToken)
      .query({ challengeId: challenge2.data.id })
      .then((res) => res.body);
    expect(downloadTemplateRes.code).toBe(200);
    expect(downloadTemplateRes.data).toBeDefined();
    expect(downloadTemplateRes.data.length).toBe(1);
    console.log('用户：获取作答模板下载地址成功');

    // 上传作答
    const answerFileBuffer: Buffer = fs.readFileSync(
      path.resolve(__dirname, 'test-files/index.html'),
    );
    const uploadAnswerRes = await POST(`/challenges/upload-answer`)
      .set('authorization', userToken)
      .attach('files', answerFileBuffer, 'index.html')
      .then((res) => res.body);
    expect(uploadAnswerRes.code).toBe(200);
    expect(uploadAnswerRes.data).toBeDefined();
    expect(uploadAnswerRes.data.length).toBe(1);
    const [userAnswerId] = uploadAnswerRes.data;
    console.log('用户：上传作答成功');

    // 启动执行
    const executeRes = await POST(`/tasks/launch-execute`)
      .set('authorization', userToken)
      .send({
        challengeId: challenge2.data.id,
        submitFileId: userAnswerId,
      })
      .then((res) => res.body);
    expect(executeRes.code).toBe(201);
    console.log('用户：启动执行成功');

    // 等待 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 获取执行结果
    const executeResult = await GET(`/submissions/one-submission`)
      .set('authorization', userToken)
      .query({ submissionId: executeRes.data.submissionId })
      .then((res) => res.body);
    expect(executeResult.code).toBe(200);
    expect(executeResult.data).toBeDefined();
    expect(executeResult.data).toHaveProperty('status', 'passed');
    console.log('用户：获取执行结果成功');

    // 删除挑战
    const deleteRes = await POST(`/challenges/remove/${challenge2.data.id}`)
      .set('authorization', superAdminToken)
      .then((res) => res.body);
    expect(deleteRes.code).toBe(200);
    console.log('管理员：删除挑战成功');
  });
});
