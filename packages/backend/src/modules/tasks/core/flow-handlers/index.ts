import { Page } from 'playwright';
import {
  handleMouseActions,
  handleTriggerAction,
} from './actions/actions.handler';
import { HandlerOptions, HandleResult } from './index.type';
import {
  handleExpectTestpointAction,
  handleScreenShotTestpointAction,
} from './testpoints/testpoints.handler';

/**
 * 构造测试结果，返回 HandleResult 对象。
 * @param success 是否成功
 * @param msg 测试结果消息
 * @param score 测试结果分数
 * @returns 测试结果对象
 */
function res(success: boolean, msg: string, score: number): HandleResult {
  return { success, msg, score };
}

/**
 * 调用该函数来处理一条流程数据。
 *
 * 如果流程数据是一个操作，将会返回 undefined。
 * 如果流程数据是测试点，将会返回测试结果：
 * - `msg`: 测试结果消息
 * - `success`: 测试是否成功
 * （一般只有在抛出异常时才会失败，正常测试得分为 0 不算失败）
 * - `score`: 测试结果分数
 *
 * @param page 页面
 * @param data 流程数据
 * @returns 测试结果
 * - `msg`: 测试结果消息
 * - `success`: 测试是否成功
 * - `score`: 测试结果分数
 */
export default async function handleOneFlowData(
  page: Page,
  data: HandlerOptions,
): Promise<HandleResult> {
  if (data.type === 'mouse') {
    try {
      await handleMouseActions(page, data.detail);
    } catch (error) {
      return res(false, error.message, 0);
    }
    return res(true, 'ok', 0);
  }

  if (data.type === 'trigger') {
    try {
      await handleTriggerAction(page, data.detail);
    } catch (error) {
      return res(false, error.message, 0);
    }
    return res(true, 'ok', 0);
  }

  if (data.type === 'testpoint') {
    if (data.detail.type === 'screenshot') {
      const { testImgBuffer } = data.detail;
      const { msg, score } = await handleScreenShotTestpointAction({
        page,
        detail: data.detail,
        testImgBuffer,
      });
      return res(true, msg, score);
    } else {
      const { msg, score } = await handleExpectTestpointAction({
        page,
        detail: data.detail,
      });
      return res(true, msg, score);
    }
  }

  throw new Error('未知的 action 类型');
}
