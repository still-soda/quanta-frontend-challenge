import {
  MoveMouseFlowData,
  ClickMouseFlowData,
  ScrollMouseFlowData,
} from './mouse-flow-data.type';
import {
  $enum,
  $number,
  $object,
  $string,
  $value,
  fit,
} from '@challenge/utils';

export function validateMoveMouseFlowData(
  data: MoveMouseFlowData,
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: $value('mouse'),
      detail: $object({
        type: $value('move'),
        x: $number().optional(),
        y: $number().optional(),
        selector: $string().optional(),
      }),
    },
    shouldThrow,
  );
}

export function validateClickMouseFlowData(
  data: ClickMouseFlowData,
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: $value('mouse'),
      detail: $object({
        type: $enum('click', 'dbclick'),
        button: $enum('left', 'right', 'middle').optional(),
        x: $number().optional(),
        y: $number().optional(),
        selector: $string().optional(),
      }),
    },
    shouldThrow,
  );
}

export function validateScrollMouseFlowData(
  data: ScrollMouseFlowData,
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: $value('mouse'),
      detail: $object({
        type: $value('scroll'),
        x: $number().optional(),
        y: $number().optional(),
      }),
    },
    shouldThrow,
  );
}
