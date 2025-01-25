import { ExpectTestpointFlowData, ScreenShotTestpointFlowData } from '../index';
import {
  validateExpectTestpointFlowData,
  validateScreenShotTestpointFlowData,
} from '..';

describe('TestpointFlowDataValidator - ScreenShot', () => {
  it('应该正确验证流程数据', () => {
    const flowdata: ScreenShotTestpointFlowData = {
      type: 'testpoint',
      detail: {
        name: 'test',
        score: 100,
        type: 'screenshot',
        root: 'root',
        threshold: 0.1,
      },
    };

    expect(validateScreenShotTestpointFlowData(flowdata)).toHaveProperty(
      'ok',
      true,
    );
  });

  it('应该返回 false，因为缺少root字段', () => {
    const flowdata: any = {
      type: 'testpoint',
      detail: {
        name: 'test',
        score: 100,
        type: 'screenshot',
        threshold: 0.1,
      },
    };

    expect(validateScreenShotTestpointFlowData(flowdata)).toHaveProperty(
      'ok',
      false,
    );
  });
});

describe('TestpointFlowDataValidator - Expect', () => {
  it('应该正确验证流程数据（全缺省）', () => {
    const flowdata: ExpectTestpointFlowData = {
      type: 'testpoint',
      detail: {
        name: 'test',
        score: 100,
        type: 'expect',
        exist: true,
        selector: 'selector',
      },
    };

    expect(validateExpectTestpointFlowData(flowdata)).toHaveProperty(
      'ok',
      true,
    );
  });

  it('应该正确验证流程数据（无缺省）', () => {
    const flowdata: ExpectTestpointFlowData = {
      type: 'testpoint',
      detail: {
        name: 'test',
        score: 100,
        type: 'expect',
        exist: true,
        selector: 'selector',
        compare: 'eq',
        attr: '20',
        text: 'text',
        typeParser: 'number',
        style: {
          color: {
            value: 'red',
            compare: 'eq',
          },
        },
      },
    };

    expect(validateExpectTestpointFlowData(flowdata)).toHaveProperty(
      'ok',
      true,
    );
  });

  it('应该返回 false，因为缺少type字段', () => {
    const flowdata: any = {
      type: 'testpoint',
      detail: {
        name: 'test',
        score: 100,
        selector: 'selector',
        text: 'text',
      },
    };

    expect(validateExpectTestpointFlowData(flowdata)).toHaveProperty(
      'ok',
      false,
    );
  });
});
