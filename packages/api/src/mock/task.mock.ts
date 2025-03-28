import { MockMethod } from './types';
import { TaskApi } from '../apis';
import { POST } from './constants';
import { response } from './utils/response.utils';
import { mock } from 'mockjs';

export default [
   {
      url: TaskApi.LAUNCH_EXECUTE,
      method: POST,
      response: () =>
         response(
            'ok',
            mock({ jobId: '@id', submissionId: '@id' }),
            'Mock: 启动成功'
         ),
   },
   {
      url: TaskApi.SUBSCRIBE_PREV_TASK_COUNT,
      method: POST,
      response: () => response('ok', '0', 'Mock: 订阅成功'),
   },
] satisfies MockMethod[];
