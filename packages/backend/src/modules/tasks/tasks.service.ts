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

  async execute(challengeId: string, submitFileName: string) {}

  async preExecute(challengeId: string) {}

  async serializeFlowData(challengeId: string, flowDataDto: FlowDataDto) {
    // 验证 challengeId 是否存在
    try {
      const challenge = await this.challengesService.findOne(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
    } catch (error) {
      throw new Error('Challenge not found');
    }

    // 验证流程数据合法性
    const valid = flowDataDto.data.every((flowData) =>
      dataValidators.some((validator: Validator) => validator(flowData).ok),
    );
    if (!valid) {
      throw new Error('Invalid flow data');
    }

    const flowDataName = `${challengeId}.json`;
    try {
      const jsonContent = JSON.stringify(flowDataDto.data);
      const reuslt = await this.assetsService.saveTextFile({
        content: jsonContent,
        name: flowDataName,
        mimeType: 'application/json',
      });
      return reuslt;
    } catch (error) {
      throw new Error(`Failed to serialize flow data: ${error}`);
    }
  }

  async uploadStandardAnswer(
    challengeId: string,
    file: File,
    suffix: string = '',
  ) {
    if (suffix !== '' && !suffix.startsWith('.')) {
      suffix = `.${suffix}`;
    }

    if (!file) {
      throw new Error('File is empty');
    }

    try {
      const challenge = await this.challengesService.findOne(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
    } catch (error) {
      throw new Error('Challenge not found');
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
