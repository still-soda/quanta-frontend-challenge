import { FlowData } from '../flow-data.type';

export interface TestpointFlowData extends FlowData {
  type: 'testpoint';
  detail: {
    name: string;
    type: 'screenshot' | 'expect';
    score: number;
  };
}

export interface ScreenShotTestpointFlowData extends TestpointFlowData {
  type: 'testpoint';
  detail: {
    name: string;
    score: number;
    type: 'screenshot';
    root: string;
    threshold: number;
  };
}

export interface ExpectTestpointFlowData extends TestpointFlowData {
  type: 'testpoint';
  detail: {
    name: string;
    score: number;
    type: 'expect';
    exist?: boolean;
    selector?: string;
    text?: string;
    attr?: string;
    value?: string;
    typeParser?: 'text' | 'number' | 'boolean';
    compare?:
      | 'eq'
      | 'ne'
      | 'gt'
      | 'lt'
      | 'gte'
      | 'lte'
      | 'contains'
      | 'notContains'
      | 'match';
    style?: Record<
      string,
      {
        value: string;
        compare: 'eq' | 'ne';
      }
    >;
  };
}
