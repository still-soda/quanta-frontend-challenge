import {
  $record,
  fit,
  $boolean,
  $enum,
  $number,
  $object,
  $string,
  $value,
} from '@challenge/utils';
import {
  ExpectTestpointFlowData,
  ScreenShotTestpointFlowData,
  TestpointFlowData,
} from './testpoints-flow-data.type';

export function validateTestpointFlowData(data: TestpointFlowData) {
  return fit(data, {
    type: $value('testpoint'),
    detail: $object({
      name: $string(),
      type: $enum('screenshot', 'expect'),
      score: $number(),
    }),
  });
}

export function validateScreenShotTestpointFlowData(
  data: ScreenShotTestpointFlowData,
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: $value('testpoint'),
      detail: $object({
        name: $string(),
        score: $number(),
        type: $value('screenshot'),
        root: $string(),
        threshold: $number(),
      }),
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
      type: $value('testpoint'),
      detail: $object({
        name: $string(),
        score: $number(),
        type: $value('expect'),
        exsit: $boolean().optional(),
        selector: $string().optional(),
        text: $string().optional(),
        attr: $string().optional(),
        typeParser: $enum('text', 'number', 'boolean').optional(),
        compare: $enum(
          'eq',
          'ne',
          'gt',
          'lt',
          'gte',
          'lte',
          'contains',
          'notContains',
          'match',
        ).optional(),
        style: $record(
          $string(),
          $object({
            value: $string(),
            compare: $enum('eq', 'ne'),
          }),
        ).optional(),
      }),
    },
    shouldThrow,
  );
}
