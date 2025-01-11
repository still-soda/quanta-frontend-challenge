import { Injectable } from '@nestjs/common';
import { FlowDataDto } from './dto/flow-data.dto';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class TasksService {
  constructor(private readonly assetsService: AssetsService) {}

  async execute(challengeId: string, submitFileName: string) {}

  async preExecute(challengeId: string) {}

  async serializeFlowData(challengeId: string, flowDataDto: FlowDataDto) {
    // 验证流程数据合法性

    const flowDataName = `${challengeId}.json`;
    try {
      const jsonContent = JSON.stringify(flowDataDto.data);
      const reuslt = await this.assetsService.saveTextFile(
        jsonContent,
        flowDataName,
        true,
      );
      return reuslt;
    } catch (error) {
      throw new Error('Failed to serialize flow data');
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

    const fileName = `${challengeId}${suffix}`;
    return this.assetsService.saveFile(file, fileName);
  }
}
