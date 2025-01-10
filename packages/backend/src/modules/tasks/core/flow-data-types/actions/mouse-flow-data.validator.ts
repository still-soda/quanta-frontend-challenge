import {
  MouseFlowData,
  MoveMouseFlowData,
  ClickMouseFlowData,
} from './mouse-flow-data.type';
import { fit, Optional } from '@challenge/utils';

export function validateMouseFlowData(data: MouseFlowData) {
  return fit(data, {
    type: 'mouse',
    detail: {
      type: ['move', 'click'],
    },
  });
}

export function validateMoveMouseFlowData(data: MoveMouseFlowData) {
  return fit(data, {
    type: 'mouse',
    detail: {
      type: 'move',
      x: Optional('number'),
      y: Optional('number'),
      selector: Optional('string'),
    },
  });
}

export function validateClickMouseFlowData(data: ClickMouseFlowData) {
  return fit(data, {
    type: 'mouse',
    detail: {
      type: 'click',
    },
  });
}
