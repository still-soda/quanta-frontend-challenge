import { Page } from 'playwright';
import {
  handleMouseActions,
  handleTriggerAction,
} from './actions/actions.handler';
import { HandlerOptions, HandlingResult } from './index.type';
import {
  handleExpectTestpointAction,
  handleScreenShotTestpointAction,
} from './testpoints/testpoints.handler';

/**
 * 构造测试结果，返回 HandlingResult 对象。
 * @param success 是否成功
 * @param msg 测试结果消息
 * @param score 测试结果分数
 * @returns 测试结果对象
 */
function res(success: boolean, msg: string, score: number): HandlingResult {
  return { success, msg, score };
}

/**
 * 调用该函数来处理一条流程数据。
 *
 * 处理完流程数据后，该函数将会返回以下结果：
 * - `msg`: 测试结果消息
 * - `success`: 测试是否成功
 * （一般只有在抛出异常时才会失败，正常测试得分为 0 不算失败）
 * - `score`: 测试结果分数
 *
 * @param page 页面
 * @param data 流程数据
 */
export default async function handleOneFlowData(
  page: Page,
  data: HandlerOptions,
): Promise<HandlingResult> {
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
      try {
        const { testImgBuffer } = data.detail;
        const { msg, score } = await handleScreenShotTestpointAction({
          page,
          detail: data.detail,
          testImgBuffer,
        });
        return res(true, msg, score);
      } catch (error) {
        return res(false, error.message, 0);
      }
    } else {
      try {
        const { msg, score } = await handleExpectTestpointAction({
          page,
          detail: data.detail,
        });
        return res(true, msg, score);
      } catch (error) {
        return res(false, error.message, 0);
      }
    }
  }

  return res(false, '未知的流程数据类型', 0);
}
