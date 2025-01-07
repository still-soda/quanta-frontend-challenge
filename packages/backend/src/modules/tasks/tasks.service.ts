import { Injectable } from '@nestjs/common';
import { FlowDataDto } from './dto/flow-data.dto';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class TasksService {
  constructor(private readonly assetsService: AssetsService) {}

  execute(challengeId: string, fileName: string) {}

  preExecute(challengeId: string) {}

  serializeFlowData(challengeId: string, flowData: FlowDataDto) {
    const flowDataName = `${challengeId}.json`;
  }
}
