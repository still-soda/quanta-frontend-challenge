import { Injectable } from '@nestjs/common';
import { FlowDataDto } from './dto/flow-data.dto';

@Injectable()
export class TasksService {
  execute(challengeId: string, fileName: string) {}

  preExecute(challengeId: string) {}

  serializeFlowData(flowData: FlowDataDto) {}
}
