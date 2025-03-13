import { RequestResult } from '@/types/request';
import { post } from '@challenge/api';

type LaunchExecuteResponse = {
   jobId: string;
   submissionId: string;
};

/**
 * 启动执行
 * @api /tasks/launch-execute
 * @param challengeId 挑战 ID
 * @param submitFileId 提交文件 ID
 * @returns 启动执行结果
 */
export async function launchExecute(challengeId: string, submitFileId: string) {
   return post<RequestResult<LaunchExecuteResponse>>('/tasks/launch-execute', {
      body: JSON.stringify({ challengeId, submitFileId }),
      headers: { 'Content-Type': 'application/json' },
   });
}

type SubscribeOptions = {
   submissionsId: string;
   onMessage?: (message: string) => void;
   onError?: () => void;
   onOpen?: () => void;
};

/**
 * 订阅前一个任务的任务数量
 * @param options 订阅选项
 * - `submissionsId` 提交 ID
 * - `onMessage` 消息处理函数
 * - `onError` 错误处理函数
 * - `onOpen` 打开处理函数
 * @returns 取消订阅函数
 */
export async function subscribePrevTaskCount(options: SubscribeOptions) {
   const { submissionsId, onMessage, onError, onOpen } = options;
   const sse = new EventSource(
      `/tasks/subscribe-prev-task-count/${submissionsId}`
   );
   sse.onmessage = (event) => onMessage && onMessage(event.data);
   sse.onerror = () => onError && onError();
   sse.onopen = () => onOpen && onOpen();
   return () => sse.close();
}
