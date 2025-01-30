import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, chromium } from 'playwright';
import { AssetsService } from '../assets/assets.service';
import { ChallengesService } from '../challenges/challenges.service';
import { explainOneFlowData, handleOneFlowData } from './core';
import { dataValidators, FlowData, Validator } from './core/flow-data';
import { HandlerOptions } from './core/flow-handlers/index.type';
import { FlowDataDto } from './dto/flow-data.dto';

/**
 * 这个接口定义了执行结果的数据结构。
 * - `msg` 用来存储执行结果的消息
 * - `score` 用来存储得分
 * - `success` 用来存储是否执行成功
 */
export interface HandleResult {
  msg: string;
  score: number;
  success: boolean;
}

/**
 * 这个接口定义了预执行结果的数据结构。
 * - `result` 一个包含执行结果的数组
 * - `passed` 是否通过预执行进入准备发布状态
 * - `score` 得分
 * - `totalScore` 满分
 */
export interface PreExecuteResult {
  result: HandleResult[];
  passed: boolean;
  score: number;
  totalScore: number;
}

/**
 * 这个接口定义了执行结果的数据结构。
 * - `result` 一个包含执行结果的数组
 * - `screenshotIdList` 一个包含截图 ID 的数组
 * - `passed` 是否通过挑战
 * - `score` 得分
 * - `totalScore` 满分
 */
export interface ExecuteResult {
  result: HandleResult[];
  screenshotIdList: string[];
  score: number;
  totalScore: number;
  passed: boolean;
}

@Injectable()
export class JudgementsService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly challengesService: ChallengesService,
  ) {}

  async onModuleInit() {
    this.browser = await chromium.launch({ headless: true });
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  async getContext() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: true });
    }
    return await this.browser.newContext();
  }

  /**
   * 这个函数用来执行挑战。要求挑战的状态为 `published`。
   *
   * 这个函数接受一个 `challengeId` 和一个 `submitFileName`，然后将会取出
   * `challengeId` 对应的预执行结果数据。然后对 `submitFileId` 对应的提交文件
   * 进行执行，生成得分和截图，将他们与预执行结果数据进行比对，得到最终得分。
   *
   * 最后将会返回执行结果。
   *
   * @param challengeId 挑战 ID
   * @param submitFileId 提交文件 ID
   * @returns
   * - `result` 一个包含执行结果的数组
   *    - `msg` 用来存储执行结果的消息
   *    - `score` 用来存储得分
   *    - `success` 用来存储是否执行成功
   * - `screenshotIdList` 一个包含截图 ID 的数组
   * - `passed` 是否通过挑战
   * @throws
   * - 找不到 Challenge
   * - 挑战未发布
   * - 流程数据不存在
   * - 流程数据为空
   * - 流程数据解析失败
   * - 提交文件不存在
   * - 截图测试点的参考截图记录不存在
   * - 截图测试点的参考截图文件不存在
   */
  async execute(
    challengeId: string,
    submitFileId: string,
  ): Promise<ExecuteResult> {
    // 1. 取出挑战的流程数据，验证是否存在
    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw new Error('找不到 Challenge');
    }
    if (challenge.status !== 'published') {
      throw new Error('挑战未发布');
    }

    // 2. 取出预执行结果数据，验证是否存在
    const { flowdataId } = challenge;
    if (!flowdataId) {
      const { exists } = await this.assetsService.isFileExists({
        id: flowdataId,
      });
      if (!exists) {
        throw new Error('流程数据不存在');
      }
    }

    // 3. 取出提交文件，验证是否存在
    const { exists } = await this.assetsService.isFileExists({
      id: submitFileId,
    });
    if (!exists) {
      throw new Error('提交文件不存在');
    }
    const submitFileContent =
      await this.assetsService.readTextFileById(submitFileId);

    // 4. 将提交文件按照流程数据执行，生成得分和截图
    const context = await this.getContext();
    const page = await context.newPage();
    await page.setContent(submitFileContent);
    await page.waitForLoadState('load');

    // 5. 将得分和截图与预执行结果数据进行比对，得到最终得分
    const flowdataText = await this.assetsService.readTextFileById(flowdataId);
    let flowdata: HandlerOptions[];
    try {
      flowdata = JSON.parse(flowdataText);
    } catch (error) {
      throw new Error('流程数据解析失败');
    }

    const executeResult: HandleResult[] = [];
    const generatedScreenshotsIdList: string[] = [];
    let passed = true;
    let screenshotCounter = 0;

    for (const flow of flowdata) {
      if (flow.type === 'testpoint' && flow.detail.type === 'screenshot') {
        const id = challenge.screenshots[screenshotCounter];
        if (!id) {
          throw new Error('截图测试点的参考截图记录不存在');
        }
        const buffer = await this.assetsService.getFileById(id);
        if (buffer === null) {
          throw new Error('截图测试点的参考截图文件不存在');
        }
        flow.detail.testImgBuffer = buffer;
      }

      const handleResult = await handleOneFlowData(page, flow as any);

      if (handleResult.generateImgBuffer) {
        const { id } = await this.assetsService.saveFile({
          file: handleResult.generateImgBuffer,
          name: `${challengeId}-${flowdataId}.png`,
          mimeType: 'image/png',
        });
        generatedScreenshotsIdList.push(id);
      }

      const flowExplaination = explainOneFlowData(flow as any);
      executeResult.push({
        msg: `${flowExplaination} :: ${handleResult.msg}`,
        score: handleResult.score,
        success: handleResult.success,
      });

      if (!handleResult.success) {
        passed = false;
        break;
      }
    }

    // 6. 将最终得分存储到 submittions 表中
    const testScore = executeResult.reduce((acc, cur) => acc + cur.score, 0);
    const fullScore = flowdata.reduce(
      (acc, cur) => acc + ((cur.detail as any).score ?? 0),
      0,
    );
    passed &&= testScore === fullScore;

    // 7. 返回执行结果
    await context.close();
    return {
      result: executeResult,
      screenshotIdList: generatedScreenshotsIdList,
      score: testScore,
      totalScore: fullScore,
      passed,
    };
  }

  /**
   * 调用这个函数来预执行挑战。
   *
   * 这个函数接受一个 `challengeId`，取出挑战的流程数据，然后按照流程数据执行，
   * 生成得分和截图，并将他们关联在挑战上。
   *
   * 最终会根据得分是否是满分来确定挑战是否一个可发布的挑战。
   *
   * @param challengeId 挑战 ID
   * @returns
   * - `result` 一个包含执行结果的数组
   *    - `msg` 用来存储执行结果的消息
   *    - `score` 用来存储得分
   *    - `success` 用来存储是否执行成功
   * - `passed` 是否通过预执行进入准备发布状态
   * @throws
   * - 找不到 Challenge
   * - 流程数据不存在
   * - 流程数据为空
   * - 流程数据解析失败
   * - 标准答案未设置
   * - 标准答案文件不存在
   * - 设置挑战为发布状态失败
   */
  async preExecute(challengeId: string): Promise<PreExecuteResult> {
    const challenge = await this.challengesService.findOne(challengeId);
    if (!challenge) {
      throw new Error('找不到 Challenge');
    }

    // 1. 取出挑战的流程数据，验证是否存在
    const { flowdataId } = challenge;
    if (!flowdataId) {
      const { exists } = await this.assetsService.isFileExists({
        id: flowdataId,
      });
      if (!exists) {
        throw new Error('流程数据不存在');
      }
    }

    const flowdataText = await this.assetsService.readTextFileById(flowdataId);
    if (flowdataText === '') {
      throw new Error('流程数据为空');
    }

    let flowdata: FlowData[];
    try {
      flowdata = JSON.parse(flowdataText);
    } catch (error) {
      throw new Error('流程数据解析失败');
    }

    // 2. 取出挑战的标准答案，验证是否存在
    const { standardAnswer } = challenge;
    if (standardAnswer.length === 0) {
      throw new Error('标准答案未设置');
    }

    const stdAnswerContent = await this.assetsService.readTextFileById(
      standardAnswer[0],
    );
    if (!stdAnswerContent) {
      throw new Error('标准答案文件不存在');
    }

    const context = await this.getContext();
    const page = await context.newPage();
    await page.setContent(stdAnswerContent);
    await page.waitForLoadState('load');

    // 3. 将标准答案按照流程数据执行，生成得分和截图
    const executeResult: HandleResult[] = [];
    const generatedScreenshotsIdList: string[] = [];
    let passed = true;
    for (const flow of flowdata) {
      const handleResult = await handleOneFlowData(page, flow as any, true);

      if (handleResult.generateImgBuffer) {
        const { id } = await this.assetsService.saveFile({
          file: handleResult.generateImgBuffer,
          name: `${challengeId}-${flowdataId}.png`,
          mimeType: 'image/png',
        });
        generatedScreenshotsIdList.push(id);
      }

      const flowExplaination = explainOneFlowData(flow as any, true);
      executeResult.push({
        msg: `${flowExplaination} :: ${handleResult.msg}`,
        score: handleResult.score,
        success: handleResult.success,
      });

      if (!handleResult.success) {
        passed = false;
        break;
      }
    }

    // 4. 将截图 Id 关联在挑战上
    await this.challengesService.setScreenshot(
      challengeId,
      generatedScreenshotsIdList,
    );

    // 5. 判断得分是否是满分，如果是满分，将挑战设置为可发布
    const fullScore = flowdata.reduce(
      (acc, cur) => acc + ((cur.detail.score as number) ?? 0),
      0,
    );
    const testScore = executeResult.reduce((acc, cur) => acc + cur.score, 0);
    passed &&= testScore === fullScore;

    if (passed) {
      const result = await this.challengesService.setStatusToReady(challengeId);
      if (!result || result.status !== 'ready') {
        throw new Error('设置挑战为准备发布状态失败');
      }
    }

    // 6. 做最后的处理，返回执行结果
    await context.close();
    return {
      result: executeResult,
      score: testScore,
      totalScore: fullScore,
      passed,
    };
  }

  /**
   * 这个函数将会序列化流程数据，并将其保存到数据库中。
   *
   * 这个函数接受一个 `challengeId` 和一个 `FlowDataDto` 对象，先对 `challengeId`
   * 进行验证，然后对 `FlowDataDto` 对象中的数据进行验证，最后将数据序列化为
   * JSON 字符串并保存到数据库中。
   *
   * 最后，函数会返回保存的文件的信息。
   *
   * @param challengeId 挑战 ID
   * @param flowDataDto 流程数据
   * @returns 保存的文件信息
   * @throws
   * - 找不到 Challenge
   * - 非法的流程数据
   * - 序列化流程数据失败: {msg}
   * - 流程总分必须大于 0
   * - 至少要有一个测试点
   */
  async serializeFlowData(challengeId: string, flowDataDto: FlowDataDto) {
    // 验证 challengeId 是否存在
    try {
      const challenge = await this.challengesService.findOne(challengeId);
      if (!challenge) {
        throw new Error('找不到 Challenge');
      }
    } catch (error) {
      throw new Error('找不到 Challenge');
    }

    // 验证总分大于 0，测试点数量大于 0
    let totalScore = 0;
    let testpointsCount = 0;
    flowDataDto.data.forEach((flowData) => {
      totalScore += (flowData.detail as any).score ?? 0;
      testpointsCount += flowData.type === 'testpoint' ? 1 : 0;
    });
    if (totalScore <= 0) {
      throw new Error('流程总分必须大于 0');
    }

    if (testpointsCount <= 0) {
      throw new Error('至少要有一个测试点');
    }

    // 验证流程数据合法性
    const valid = flowDataDto.data.every((flowData) =>
      dataValidators.some((validator: Validator) => validator(flowData).ok),
    );
    if (!valid) {
      throw new Error('非法的流程数据');
    }

    const flowDataName = `${challengeId}.json`;
    try {
      const jsonContent = JSON.stringify(flowDataDto.data);
      const reuslt = await this.assetsService.saveTextFile({
        content: jsonContent,
        name: flowDataName,
        mimeType: 'application/json',
      });
      await this.challengesService.setFlowData(challengeId, reuslt.id);
      return reuslt;
    } catch (error) {
      throw new Error(`序列化流程数据失败: ${error}`);
    }
  }

  /**
   * 调用这个函数来上传标准答案。
   * @param challengeId 挑战 ID
   * @param file 标准答案文件 ID
   * @param suffix 文件后缀
   * @returns 保存的文件信息
   */
  async uploadStandardAnswer(
    challengeId: string,
    file: File,
    suffix: string = '',
  ) {
    if (suffix !== '' && !suffix.startsWith('.')) {
      suffix = `.${suffix}`;
    }

    if (!file) {
      throw new Error('文件不存在');
    }

    try {
      const challenge = await this.challengesService.findOne(challengeId);
      if (!challenge) {
        throw new Error('找不到 Challenge');
      }
    } catch (error) {
      throw new Error('找不到 Challenge');
    }

    const saveResult = await this.assetsService.saveFile({
      file,
      name: file.name,
      mimeType: 'text/html',
    });
    await this.challengesService.setStandardAnswer(challengeId, [
      saveResult.id,
    ]);
    return saveResult;
  }
}
