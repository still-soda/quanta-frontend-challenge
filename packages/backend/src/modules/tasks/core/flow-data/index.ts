// VALIDATORS
import * as MouseFlowDataValidators from './actions/mouse-flow-data.validator';
import * as TriggerFlowDataValidators from './actions/trigger-flow-data.validator';
import { FlowData } from './flow-data.type';
import * as TestpointsFlowDataValidators from './testpoints/testpoints-flow-data.validator';

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
