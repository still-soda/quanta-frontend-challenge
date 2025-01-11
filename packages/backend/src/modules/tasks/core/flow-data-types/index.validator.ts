import * as MouseFlowDataValidators from './actions/mouse-flow-data.validator';
import * as TestpointsFlowDataValidators from './testpoints/testpoints-flow-data.validator';
export const rootValidators = [
  MouseFlowDataValidators.validateClickMouseFlowData,
  MouseFlowDataValidators.validateMoveMouseFlowData,
  TestpointsFlowDataValidators.validateExpectTestpointFlowData,
  TestpointsFlowDataValidators.validateScreenShotTestpointFlowData,
  TestpointsFlowDataValidators,
];

export * from './actions/mouse-flow-data.validator';
export * from './testpoints/testpoints-flow-data.validator';
