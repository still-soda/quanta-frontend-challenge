import { Injectable } from '@nestjs/common';
import { FlowDataDto } from './dto/flow-data.dto';
import { AssetsService } from '../assets/assets.service';
import { dataValidators, Validator } from './core/flow-data';
import { ChallengesService } from '../challenges/challenges.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly challengesService: ChallengesService,
  ) {}

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
   * @todo
   */
  async preExecute(challengeId: string) {
    // 1. 取出挑战的流程数据，验证是否存在
    // 2. 取出挑战的标准答案，验证是否存在
    // 3. 将标准答案按照流程数据执行，生成得分和截图
    // 4. 将得分和截图关联在挑战上
    // 5. 判断得分是否是满分，如果是满分，将挑战设置为可发布
    // 6. 返回执行结果
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
   * @param file 标准答案文件
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

    const fileName = `${challengeId}${suffix}`;
    await this.challengesService.setStandardAnswer(challengeId, [fileName]);
    return this.assetsService.saveFile({
      file,
      name: fileName,
      mimeType: 'text/html',
    });
  }
}
