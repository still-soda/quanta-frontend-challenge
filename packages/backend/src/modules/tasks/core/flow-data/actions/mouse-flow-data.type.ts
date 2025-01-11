import { FlowData } from '../flow-data.type';

export interface MouseFlowData extends FlowData {
  type: 'mouse';
  detail: {
    type: 'move' | 'click' | 'dbclick' | 'scroll';
  };
}

export interface MoveMouseFlowData extends MouseFlowData {
  type: 'mouse';
  detail: {
    type: 'move';
    x?: number;
    y?: number;
    selector?: string;
  };
}

export interface ClickMouseFlowData extends MouseFlowData {
  type: 'mouse';
  detail: {
    type: 'click' | 'dbclick';
  };
}

export interface ScrollMouseFlowData extends MouseFlowData {
  type: 'mouse';
  detail: {
    type: 'scroll';
    x?: number;
    y?: number;
  };
}
