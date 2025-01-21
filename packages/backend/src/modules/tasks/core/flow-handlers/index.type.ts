/// 这个文件用于定义各种 action-data 的集合类型
/// ${TYPE}ActionData 对应所有 ${TYPE} 类型的 action-data（主要体现在 detail 属性上）
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
 * 测试点 action-data
 *
 * 当 `detail` 为 `ScreenShotTestpointFlowData['detail']` 时，
 * 需要携带 `testImgBuffer` 作为测试图片
 */
export interface TestpointActionData extends TestpointFlowData {
  detail:
    | (ScreenShotTestpointFlowData['detail'] & { testImgBuffer: Buffer })
    | ExpectTestpointFlowData['detail'];
}

/**
 * 鼠标事件 action-data
 */
export interface MouseActionData extends MouseFlowData {
  detail: MouseActionsDetail;
}

/**
 * 触发器 action-data
 */
export interface TriggerActionData extends TriggerFlowData {
  detail: TriggerActionsDetail;
}

/**
 * 所有 action-data 类型
 */
export type ActionData =
  | TestpointActionData
  | MouseActionData
  | TriggerActionData;

/**
 * 鼠标事件和触发事件等操作的结果
 * - `msg`: 操作结果消息
 * - `success`: 操作是否成功
 * - `score`: 操作结果分数，非测试点操作一般为 0
 */
export interface ActionResult {
  msg: string;
  success: boolean;
  score: number;
}
