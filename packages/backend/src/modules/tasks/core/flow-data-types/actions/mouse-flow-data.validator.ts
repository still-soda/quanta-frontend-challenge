import { MoveMouseFlowData, ClickMouseFlowData } from './mouse-flow-data.type';
import { fit, Optional } from '@challenge/utils';

export function validateMoveMouseFlowData(
  data: MoveMouseFlowData,
  shouldThrow = false,
) {
  return fit(
    data,
    {
      type: 'mouse',
      detail: {
        type: 'move',
        x: Optional('number'),
        y: Optional('number'),
        selector: Optional('string'),
      },
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
      type: 'mouse',
      detail: {
        type: 'click',
      },
    },
    shouldThrow,
  );
}
