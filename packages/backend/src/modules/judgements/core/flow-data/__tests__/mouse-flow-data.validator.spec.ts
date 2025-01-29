import {
  validateClickMouseFlowData,
  validateMoveMouseFlowData,
  validateScrollMouseFlowData,
  ClickMouseFlowData,
  MoveMouseFlowData,
  ScrollMouseFlowData,
} from '..';

describe('MouseFlowDataValidator', () => {
  describe('Move', () => {
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

  describe('Click', () => {
    it('应该正确验证流程数据（无缺省）', () => {
      const data: ClickMouseFlowData = {
        type: 'mouse',
        detail: {
          type: 'click',
          button: 'left',
          x: 1,
          y: 1,
          selector: 'selector',
        },
      };
      expect(validateClickMouseFlowData(data)).toHaveProperty('ok', true);
    });

    it('应该正确验证流程数据（有缺省）', () => {
      const data: ClickMouseFlowData = {
        type: 'mouse',
        detail: {
          type: 'click',
          button: 'left',
        },
      };
      expect(validateClickMouseFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false（非缺省字段）', () => {
      const data: any = {
        type: 'mouse',
        detail: {
          type: 'click2',
          button: 'left',
          x: 1,
          y: 1,
        },
      };
      expect(validateClickMouseFlowData(data)).toHaveProperty('ok', false);
    });

    it('在字段不合法时应该返回 ok:false（缺省字段）', () => {
      const data: any = {
        type: 'mouse',
        detail: {
          type: 'click',
          button: 'left',
          x: '1',
        },
      };
      expect(validateClickMouseFlowData(data)).toHaveProperty('ok', false);
    });
  });

  describe('Scroll', () => {
    it('应该正确验证流程数据（无缺省）', () => {
      const data: ScrollMouseFlowData = {
        type: 'mouse',
        detail: {
          type: 'scroll',
          x: 1,
          y: 1,
        },
      };
      expect(validateScrollMouseFlowData(data)).toHaveProperty('ok', true);
    });

    it('应该正确验证流程数据（有缺省）', () => {
      const data: ScrollMouseFlowData = {
        type: 'mouse',
        detail: {
          type: 'scroll',
          x: 1,
        },
      };
      expect(validateScrollMouseFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false（非缺省字段）', () => {
      const data: any = {
        type: 'mouse',
        detail: {
          type: 'scroll2',
          x: 1,
          y: 1,
        },
      };
      expect(validateScrollMouseFlowData(data)).toHaveProperty('ok', false);
    });

    it('在字段不合法时应该返回 ok:false（缺省字段）', () => {
      const data: any = {
        type: 'mouse',
        detail: {
          type: 'scroll',
          x: '1',
        },
      };
      expect(validateScrollMouseFlowData(data)).toHaveProperty('ok', false);
    });
  });
});
