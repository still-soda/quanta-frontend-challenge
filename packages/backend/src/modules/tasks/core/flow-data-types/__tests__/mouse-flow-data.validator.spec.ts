import { ClickMouseFlowData, MoveMouseFlowData } from '../index.type';
import {
  validateClickMouseFlowData,
  validateMoveMouseFlowData,
} from '../index.validator';

describe('MouseFlowDataValidator - Move', () => {
  it('应该正确验证流程数据（无缺省）', () => {
    const data: MoveMouseFlowData = {
      type: 'mouse',
      detail: {
        type: 'move',
        x: 1,
        y: 1,
        selector: 'selector',
      },
    };
    expect(validateMoveMouseFlowData(data)).toHaveProperty('ok', true);
  });

  it('应该正确验证流程数据（有缺省）', () => {
    const data: MoveMouseFlowData = {
      type: 'mouse',
      detail: {
        type: 'move',
        x: 1,
      },
    };
    expect(validateMoveMouseFlowData(data)).toHaveProperty('ok', true);
  });

  it('在字段不合法时应该返回 ok:false（非缺省字段）', () => {
    const data: any = {
      type: 'mouse',
      detail: {
        type: 'move2',
        x: 1,
        y: 1,
        selector: 'selector',
      },
    };
    expect(validateMoveMouseFlowData(data)).toHaveProperty('ok', false);
  });

  it('在字段不合法时应该返回 ok:false（缺省字段）', () => {
    const data: any = {
      type: 'mouse',
      detail: {
        type: 'move',
        x: '1',
      },
    };
    expect(validateMoveMouseFlowData(data)).toHaveProperty('ok', false);
  });
});

describe('MouseFlowDataValidator - Click', () => {
  it('应该正确验证流程数据', () => {
    const data: ClickMouseFlowData = {
      type: 'mouse',
      detail: {
        type: 'click',
      },
    };
    expect(validateClickMouseFlowData(data)).toHaveProperty('ok', true);
  });

  it('在字段不合法时应该返回 ok:false', () => {
    const data: any = {
      type: 'mouse',
      detail: {
        type: 'click2',
      },
    };
    expect(validateClickMouseFlowData(data)).toHaveProperty('ok', false);
  });
});
