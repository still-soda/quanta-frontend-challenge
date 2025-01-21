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
 */
export interface TestpointActionData extends TestpointFlowData {
  detail:
    | ScreenShotTestpointFlowData['detail']
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
