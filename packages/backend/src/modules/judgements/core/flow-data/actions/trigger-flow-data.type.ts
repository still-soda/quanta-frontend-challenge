import { FlowData } from '../flow-data.type';

type TriggerType = 'hover' | 'focus' | 'blur' | 'input' | 'wait' | 'drag';

export interface TriggerFlowData extends FlowData {
  type: 'trigger';
  detail: {
    type: TriggerType;
  };
}

export interface HoverTriggerFlowData extends TriggerFlowData {
  type: 'trigger';
  detail: {
    type: 'hover';
    selector: string;
  };
}

export interface FocusTriggerFlowData extends TriggerFlowData {
  type: 'trigger';
  detail: {
    type: 'focus';
    selector: string;
  };
}

export interface BlurTriggerFlowData extends TriggerFlowData {
  type: 'trigger';
  detail: {
    type: 'blur';
    selector: string;
  };
}

export interface InputTriggerFlowData extends TriggerFlowData {
  type: 'trigger';
  detail: {
    type: 'input';
    selector: string;
    value: string;
  };
}

export interface WaitTriggerFlowData extends TriggerFlowData {
  type: 'trigger';
  detail: {
    type: 'wait';
    time: number;
  };
}

export interface DragTriggerFlowData extends TriggerFlowData {
  type: 'trigger';
  detail: {
    type: 'drag';
    from: string;
    to: string;
  };
}
