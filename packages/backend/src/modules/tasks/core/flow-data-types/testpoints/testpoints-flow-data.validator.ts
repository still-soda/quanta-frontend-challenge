import { fit } from '@challenge/utils';
import {
  ExpectTestpointFlowData,
  ScreenShotTestpointFlowData,
  TestpointFlowData,
} from './testpoints-flow-data.type';

export function validateTestpointFlowData(data: TestpointFlowData) {
  return fit(data, {
    type: 'testpoint',
    detail: {
      name: 'string',
      type: ['screenshot', 'expect'],
      score: 'number',
    },
  });
}

export function validateScreenShotTestpointFlowData(
  data: ScreenShotTestpointFlowData,
) {
  return fit(data, {
    type: 'testpoint',
    detail: {
      name: 'string',
      score: 'number',
      type: 'screenshot',
      root: 'string',
      threshold: 'number',
    },
  });
}

export function validateExpectTestpointFlowData(data: ExpectTestpointFlowData) {
  return fit(data, {
    type: 'testpoint',
    detail: {
      name: 'string',
      score: 'number',
      type: 'expect',
      expect: 'string',
      selector: 'string',
      text: 'string',
    },
  });
}
