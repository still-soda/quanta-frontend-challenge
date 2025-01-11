// VALIDATORS
import * as MouseFlowDataValidators from './actions/mouse-flow-data.validator';
import { FlowData } from './flow-data.type';
import * as TestpointsFlowDataValidators from './testpoints/testpoints-flow-data.validator';

export const dataValidators = [
  MouseFlowDataValidators.validateClickMouseFlowData,
  MouseFlowDataValidators.validateMoveMouseFlowData,
  TestpointsFlowDataValidators.validateExpectTestpointFlowData,
  TestpointsFlowDataValidators.validateScreenShotTestpointFlowData,
];
export * from './actions/mouse-flow-data.validator';
export * from './testpoints/testpoints-flow-data.validator';

// TYPES
export type Validator = (data: FlowData) => { ok: boolean; msg: string };
export * from './actions/mouse-flow-data.type';
export * from './testpoints/testpoints-flow-data.type';
export * from './flow-data.type';
