import {
  HoverTriggerFlowData,
  FocusTriggerFlowData,
  BlurTriggerFlowData,
  InputTriggerFlowData,
  WaitTriggerFlowData,
  DragTriggerFlowData,
} from '../actions/trigger-flow-data.type';
import {
  validateHoverTriggerFlowData,
  validateBlurTriggerFlowData,
  validateDragTriggerFlowData,
  validateFocusTriggerFlowData,
  validateInputTriggerFlowData,
  validateWaitTriggerFlowData,
} from '../actions/trigger-flow-data.validator';

describe('TriggerFlowDataValidator', () => {
  describe('Hover', () => {
    it('应该正确验证流程数据', () => {
      const data: HoverTriggerFlowData = {
        type: 'trigger',
        detail: {
          type: 'hover',
          selector: 'string',
        },
      };
      expect(validateHoverTriggerFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false', () => {
      const data: any = {
        type: 'trigger',
        detail: {
          type: 'hover',
          selector: 1,
        },
      };
      expect(validateHoverTriggerFlowData(data)).toHaveProperty('ok', false);
    });
  });

  describe('Focus', () => {
    it('应该正确验证流程数据', () => {
      const data: FocusTriggerFlowData = {
        type: 'trigger',
        detail: {
          type: 'focus',
          selector: 'string',
        },
      };
      expect(validateFocusTriggerFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false', () => {
      const data: any = {
        type: 'trigger',
        detail: {
          type: 'focus',
          selector: 1,
        },
      };
      expect(validateFocusTriggerFlowData(data)).toHaveProperty('ok', false);
    });
  });

  describe('Blur', () => {
    it('应该正确验证流程数据', () => {
      const data: BlurTriggerFlowData = {
        type: 'trigger',
        detail: {
          type: 'blur',
          selector: 'string',
        },
      };
      expect(validateBlurTriggerFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false', () => {
      const data: any = {
        type: 'trigger',
        detail: {
          type: 'blur',
          selector: 1,
        },
      };
      expect(validateBlurTriggerFlowData(data)).toHaveProperty('ok', false);
    });
  });

  describe('Input', () => {
    it('应该正确验证流程数据', () => {
      const data: InputTriggerFlowData = {
        type: 'trigger',
        detail: {
          type: 'input',
          selector: 'string',
          value: 'string',
        },
      };
      expect(validateInputTriggerFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false', () => {
      const data: any = {
        type: 'trigger',
        detail: {
          type: 'input',
          selector: 1,
          value: 'string',
        },
      };
      expect(validateInputTriggerFlowData(data)).toHaveProperty('ok', false);
    });
  });

  describe('Wait', () => {
    it('应该正确验证流程数据', () => {
      const data: WaitTriggerFlowData = {
        type: 'trigger',
        detail: {
          type: 'wait',
          time: 1,
        },
      };
      expect(validateWaitTriggerFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false', () => {
      const data: any = {
        type: 'trigger',
        detail: {
          type: 'wait',
          time: '1',
        },
      };
      expect(validateWaitTriggerFlowData(data)).toHaveProperty('ok', false);
    });
  });

  describe('Drag', () => {
    it('应该正确验证流程数据', () => {
      const data: DragTriggerFlowData = {
        type: 'trigger',
        detail: {
          type: 'drag',
          from: 'string',
          to: 'string',
        },
      };
      expect(validateDragTriggerFlowData(data)).toHaveProperty('ok', true);
    });

    it('在字段不合法时应该返回 ok:false', () => {
      const data: any = {
        type: 'trigger',
        detail: {
          type: 'drag',
          from: 1,
          to: 'string',
        },
      };
      expect(validateDragTriggerFlowData(data)).toHaveProperty('ok', false);
    });
  });
});
