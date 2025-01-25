import { Injectable, OnModuleInit } from '@nestjs/common';
import { FlowDataDto } from './dto/flow-data.dto';
import { AssetsService } from '../assets/assets.service';
import { dataValidators, FlowData, Validator } from './core/flow-data';
import { ChallengesService } from '../challenges/challenges.service';
import { Browser, chromium } from 'playwright';
import { explainOneFlowData, handleOneFlowData } from './core';

/**
 * 这个接口定义了执行结果的数据结构。
 * - `msg` 用来存储执行结果的消息
 * - `score` 用来存储得分
 * - `success` 用来存储是否执行成功
 */
interface ExecuteResult {
  msg: string;
  score: number;
  success: boolean;
}

/**
 * 这个接口定义了预执行结果的数据结构。
 * - `result` 一个包含执行结果的数组
 * - `passed` 是否通过预执行进入准备发布状态
 */
interface PreExecuteResult {
  result: ExecuteResult[];
  passed: boolean;
}

@Injectable()
export class TasksService implements OnModuleInit {
  private browser: Browser;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly challengesService: ChallengesService,
  ) {}

  async onModuleInit() {
    this.browser = await chromium.launch({ headless: true });
  }

  async getContext() {
    return await this.browser.newContext();
  }

  /**
   * 这个函数用来执行挑战。
   *
   * 这个函数接受一个 `challengeId` 和一个 `submitFileName`，然后将会取出 `challengeId`
   * 对应的预执行结果数据。然后对 `submitFileName` 对应的提交文件进行执行，生成得分和截图，
   * 将他们与预执行结果数据进行比对，得到最终得分。
   *
   * 最后将会把数据存储到 `submittions` 表中。
   *
   * @param challengeId 挑战 ID
   * @param submitFileName 提交文件名
   */
  async execute(challengeId: string, submitFileName: string) {
    // 1. 取出挑战的流程数据，验证是否存在
    // 2. 取出预执行结果数据，验证是否存在
    // 3. 取出提交文件，验证是否存在
    // 4. 将提交文件按照流程数据执行，生成得分和截图
    // 5. 将得分和截图与预执行结果数据进行比对，得到最终得分
    // 6. 将最终得分存储到 submittions 表中
    // 7. 返回执行结果
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
    const executeResult: ExecuteResult[] = [];
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

      if (!handleResult.success) {
        executeResult.push(handleResult);
        passed = false;
        break;
      } else {
        const flowExplaination = explainOneFlowData(flow as any);
        executeResult.push({
          msg: flowExplaination,
          score: handleResult.score,
          success: handleResult.success,
        });
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
      const result =
        await this.challengesService.setStatusToPublished(challengeId);
      if (!result || result.status !== 'published') {
        throw new Error('设置挑战为发布状态失败');
      }
    }

    // 6. 做最后的处理，返回执行结果
    await context.close();
    return { result: executeResult, passed };
  }

  /**
   * 这个函数将会序列化流程数据，并将其保存到数据库中。
   *
   * 这个函数接受一个 `challengeId` 和一个 `FlowDataDto` 对象，先对 `challengeId` 进行
   * 验证，然后对 `FlowDataDto` 对象中的数据进行验证，最后将数据序列化为 JSON 字符串
   * 并保存到数据库中。
   *
   * 最后，函数会返回保存的文件的信息。
   *
   * @param challengeId 挑战 ID
   * @param flowDataDto 流程数据
   * @returns 保存的文件信息
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
