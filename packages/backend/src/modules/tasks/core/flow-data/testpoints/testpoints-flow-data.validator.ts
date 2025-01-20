import { fit, Optional } from '@challenge/utils';
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
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: 'testpoint',
      detail: {
        name: 'string',
        score: 'number',
        type: 'screenshot',
        root: 'string',
        threshold: 'number',
      },
    },
    shouldThrow,
  );
}

export function validateExpectTestpointFlowData(
  data: ExpectTestpointFlowData,
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: 'testpoint',
      detail: {
        name: 'string',
        score: 'number',
        type: 'expect',
        exsit: Optional('boolean'),
        selector: Optional('string'),
        text: Optional('string'),
        attr: Optional('string'),
        typeParser: Optional(['text', 'number', 'boolean']),
      },
    },
    shouldThrow,
  );
}
