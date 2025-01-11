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
    expect: string;
    selector: string;
    text: string;
  };
}
