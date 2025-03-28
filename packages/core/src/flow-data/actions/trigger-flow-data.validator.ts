import { $number, $object, $string, $value, fit } from '@challenge/utils';
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
    type: $value('trigger'),
    detail: $object({
      type: $value('hover'),
      selector: $string(),
    }),
  });
}

export function validateFocusTriggerFlowData(data: FocusTriggerFlowData) {
  return fit(data, {
    type: $value('trigger'),
    detail: $object({
      type: $value('focus'),
      selector: $string(),
    }),
  });
}

export function validateBlurTriggerFlowData(data: BlurTriggerFlowData) {
  return fit(data, {
    type: $value('trigger'),
    detail: $object({
      type: $value('blur'),
      selector: $string(),
    }),
  });
}

export function validateInputTriggerFlowData(data: InputTriggerFlowData) {
  return fit(data, {
    type: $value('trigger'),
    detail: $object({
      type: $value('input'),
      selector: $string(),
      value: $string(),
    }),
  });
}

export function validateWaitTriggerFlowData(data: WaitTriggerFlowData) {
  return fit(data, {
    type: $value('trigger'),
    detail: $object({
      type: $value('wait'),
      time: $number(),
    }),
  });
}

export function validateDragTriggerFlowData(data: DragTriggerFlowData) {
  return fit(data, {
    type: $value('trigger'),
    detail: $object({
      type: $value('drag'),
      from: $string(),
      to: $string(),
    }),
  });
}
