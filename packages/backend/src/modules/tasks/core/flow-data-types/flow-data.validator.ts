import { fit } from '@challenge/utils';
import { FlowData } from './flow-data.type';

export function validateFlowData(data: FlowData) {
  return fit(data, {
    type: 'flow',
    detail: {
      type: 'string',
    },
  });
}
