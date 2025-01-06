import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskExecutionService {
  excuteTask(challengeId: string, fileName: string) {}

  preExcuteTask(challengeId: string) {}
}
