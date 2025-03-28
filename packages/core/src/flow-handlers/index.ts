import { Page } from 'playwright';
import {
  handleMouseAction,
  handleTriggerAction,
} from './actions/actions.handler';
import { HandlerOptions, HandlingResult } from './index.type';
import {
  handleExpectTestpointAction,
  handleScreenShotTestpointAction,
  handleScreenShotTestpointPreAction,
} from './testpoints/testpoints.handler';

/**
 * 构造测试结果，返回 HandlingResult 对象。
 * @param success 是否成功
 * @param msg 测试结果消息
 * @param score 测试结果分数
 * @param generateImgBuffer 生成的图片缓冲区，默认为 `null`，仅在截图测试点中存在
 * @returns 测试结果对象
 */
function res(
  success: boolean,
  msg: string,
  score: number,
  generateImgBuffer: Buffer = null,
): HandlingResult {
  return { success, msg, score, generateImgBuffer };
}

/**
 * 调用该函数来处理一条流程数据。
 *
 * 处理完流程数据后，该函数将会返回以下结果：
 * - `msg`: 测试结果消息
 * - `success`: 测试是否成功
 * （一般只有在抛出异常时才会失败，正常测试得分为 0 不算失败）
 * - `score`: 测试结果分数
 * - `generateImgBuffer`: 生成的图片缓冲区，**仅在截图测试点中存在**
 *
 * 当 `success` 为 `false` 的时候，意味着抛出了异常，此时 `score` 为 0，
 * `msg` 为异常消息。需要在外部处理异常。
 *
 * @param page 页面
 * @param data 流程数据
 * @param isPre 是否是预执行，默认为 `false`
 */
export async function handleOneFlowData(
  page: Page,
  data: HandlerOptions,
  isPre: boolean = false,
): Promise<HandlingResult> {
  if (data.type === 'mouse') {
    try {
      await handleMouseAction({ page, detail: data.detail });
    } catch (error) {
      return res(false, error.message, 0);
    }
    return res(true, 'ok', 0);
  }

  if (data.type === 'trigger') {
    try {
      await handleTriggerAction({ page, detail: data.detail });
    } catch (error) {
      return res(false, error.message, 0);
    }
    return res(true, 'ok', 0);
  }

  if (data.type === 'testpoint') {
    if (data.detail.type === 'screenshot') {
      try {
        const fn = isPre
          ? handleScreenShotTestpointPreAction
          : handleScreenShotTestpointAction;
        const { testImgBuffer } = data.detail;
        const { msg, score, generatedImgBuffer } = await fn({
          page,
          detail: data.detail,
          testImgBuffer,
        } as any);
        return res(true, msg, score, generatedImgBuffer);
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
