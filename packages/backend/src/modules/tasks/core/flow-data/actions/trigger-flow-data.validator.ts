import { fit } from '@challenge/utils';
import {
  FocusTriggerFlowData,
  HoverTriggerFlowData,
  BlurTriggerFlowData,
  DragTriggerFlowData,
  InputTriggerFlowData,
  WaitTriggerFlowData,
} from './trigger-flow-data.type';

export function validateHoverTriggerFlowData(data: HoverTriggerFlowData) {
  return fit(data, {
    type: 'trigger',
    detail: {
      type: 'hover',
      selector: 'string',
    },
  });
}

export function validateFocusTriggerFlowData(data: FocusTriggerFlowData) {
  return fit(data, {
    type: 'trigger',
    detail: {
      type: 'focus',
      selector: 'string',
    },
  });
}

export function validateBlurTriggerFlowData(data: BlurTriggerFlowData) {
  return fit(data, {
    type: 'trigger',
    detail: {
      type: 'blur',
      selector: 'string',
    },
  });
}

export function validateInputTriggerFlowData(data: InputTriggerFlowData) {
  return fit(data, {
    type: 'trigger',
    detail: {
      type: 'input',
      selector: 'string',
      value: 'string',
    },
  });
}

export function validateWaitTriggerFlowData(data: WaitTriggerFlowData) {
  return fit(data, {
    type: 'trigger',
    detail: {
      type: 'wait',
      time: 'number',
    },
  });
}

export function validateDragTriggerFlowData(data: DragTriggerFlowData) {
  return fit(data, {
    type: 'trigger',
    detail: {
      type: 'drag',
      from: 'string',
      to: 'string',
    },
  });
}
