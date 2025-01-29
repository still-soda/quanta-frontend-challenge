/// 这个文件导出所有与流程数据 (FlowData) 相关的内容。
/// 包括数据验证器 (Validators) 和数据类型 (Types)。
/// @author: still-soda

// VALIDATORS
import * as MouseFlowDataValidators from './actions/mouse-flow-data.validator';
import * as TriggerFlowDataValidators from './actions/trigger-flow-data.validator';
import { FlowData } from './flow-data.type';
import * as TestpointsFlowDataValidators from './testpoints/testpoints-flow-data.validator';

/**
 * 所有数据验证器。
 */
export const dataValidators = [
  MouseFlowDataValidators.validateClickMouseFlowData,
  MouseFlowDataValidators.validateMoveMouseFlowData,
  MouseFlowDataValidators.validateScrollMouseFlowData,
  TriggerFlowDataValidators.validateBlurTriggerFlowData,
  TriggerFlowDataValidators.validateDragTriggerFlowData,
  TriggerFlowDataValidators.validateFocusTriggerFlowData,
  TriggerFlowDataValidators.validateHoverTriggerFlowData,
  TriggerFlowDataValidators.validateInputTriggerFlowData,
  TriggerFlowDataValidators.validateWaitTriggerFlowData,
  TestpointsFlowDataValidators.validateExpectTestpointFlowData,
  TestpointsFlowDataValidators.validateScreenShotTestpointFlowData,
];
export * from './actions/mouse-flow-data.validator';
export * from './actions/trigger-flow-data.validator';
export * from './testpoints/testpoints-flow-data.validator';

// TYPES
export type Validator = (data: FlowData) => { ok: boolean; msg: string };
export * from './actions/mouse-flow-data.type';
export * from './actions/trigger-flow-data.type';
export * from './testpoints/testpoints-flow-data.type';
export * from './flow-data.type';

import * as MouseFlowDataNS from './actions/mouse-flow-data.type';
import * as AllTriggerFlowDataNS from './actions/trigger-flow-data.type';
import * as AllTestpointsFlowDataNS from './testpoints/testpoints-flow-data.type';

export type AllMouseFlowData =
  | MouseFlowDataNS.ClickMouseFlowData
  | MouseFlowDataNS.MoveMouseFlowData
  | MouseFlowDataNS.ScrollMouseFlowData;

export type AllTriggerFlowData =
  | AllTriggerFlowDataNS.BlurTriggerFlowData
  | AllTriggerFlowDataNS.DragTriggerFlowData
  | AllTriggerFlowDataNS.FocusTriggerFlowData
  | AllTriggerFlowDataNS.HoverTriggerFlowData
  | AllTriggerFlowDataNS.InputTriggerFlowData
  | AllTriggerFlowDataNS.WaitTriggerFlowData;

export type AllTestpointsFlowData =
  | AllTestpointsFlowDataNS.ExpectTestpointFlowData
  | AllTestpointsFlowDataNS.ScreenShotTestpointFlowData;

export type AllFlowData =
  | AllMouseFlowData
  | AllTriggerFlowData
  | AllTestpointsFlowData;
