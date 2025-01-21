/// 这个文件用于定义各种 handler-options 的集合类型
/// ${TYPE}ActionData 对应所有 ${TYPE} 类型的 handler-options（主要体现在 detail 属性上）
/// @date 2025-01-21
/// @author still-soda

import {
  TestpointFlowData,
  ScreenShotTestpointFlowData,
  ExpectTestpointFlowData,
  MouseFlowData,
  TriggerFlowData,
} from '../flow-data';
import {
  MouseActionsDetail,
  TriggerActionsDetail,
} from './actions/actions.handler';

/**
 * 测试点 handler-options
 *
 * 当 `detail` 为 `ScreenShotTestpointFlowData['detail']` 时，
 * 需要携带 `testImgBuffer` 作为测试图片
 */
export interface TestpointFlowDataHandlerOptions extends TestpointFlowData {
  detail:
    | (ScreenShotTestpointFlowData['detail'] & { testImgBuffer: Buffer })
    | ExpectTestpointFlowData['detail'];
}

/**
 * 鼠标事件 handler-options
 */
export interface MouseFlowDataHandlerOptions extends MouseFlowData {
  detail: MouseActionsDetail;
}

/**
 * 触发器 handler-options
 */
export interface TriggerFlowDataHandlerOptions extends TriggerFlowData {
  detail: TriggerActionsDetail;
}

/**
 * 所有 handler-options 类型
 */
export type HandlerOptions =
  | TestpointFlowDataHandlerOptions
  | MouseFlowDataHandlerOptions
  | TriggerFlowDataHandlerOptions;

/**
 * 鼠标事件和触发事件等操作的结果
 * - `msg`: 操作结果消息
 * - `success`: 操作是否成功
 * - `score`: 操作结果分数，非测试点操作一般为 0
 */
export interface HandleResult {
  msg: string;
  success: boolean;
  score: number;
}
