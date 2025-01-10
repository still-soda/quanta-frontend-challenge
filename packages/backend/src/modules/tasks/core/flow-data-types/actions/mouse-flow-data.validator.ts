import {
  MouseFlowData,
  MoveMouseFlowData,
  ClickMouseFlowData,
} from './mouse-flow-data.type';
import { fit } from '@challenge/utils';

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
    detail: {},
  });
}
