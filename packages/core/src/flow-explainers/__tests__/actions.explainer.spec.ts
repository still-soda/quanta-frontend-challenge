import {
  explainMouseAciton,
  explainTriggerAction,
} from '../actions/actions.explainer';

describe('explainMouseAciton', () => {
  it('应该返回带选择器的点击事件描述', () => {
    const detail = { type: 'click', selector: '#button' } as any;
    expect(explainMouseAciton(detail)).toBe('点击选择器 #button');
  });

  it('应该返回不带选择器的点击坐标描述', () => {
    const detail = { type: 'click', x: 100, y: 200 } as any;
    expect(explainMouseAciton(detail)).toBe('点击坐标 (100, 200)');
  });

  it('应该返回带选择器的移动事件描述', () => {
    const detail = { type: 'move', selector: '#header' } as any;
    expect(explainMouseAciton(detail)).toBe('移动到选择器 #header');
  });

  it('应该返回不带选择器的移动坐标描述', () => {
    const detail = { type: 'move', x: 150, y: 250 } as any;
    expect(explainMouseAciton(detail)).toBe('移动到坐标 (150, 250)');
  });

  it('应该返回带选择器的双击事件描述', () => {
    const detail = { type: 'dbclick', selector: '.item' } as any;
    expect(explainMouseAciton(detail)).toBe('双击选择器 .item');
  });

  it('应该返回不带选择器的双击坐标描述', () => {
    const detail = { type: 'dbclick', x: 300, y: 400 } as any;
    expect(explainMouseAciton(detail)).toBe('双击坐标 (300, 400)');
  });

  it('应该返回带坐标的滚动事件描述', () => {
    const detail = { type: 'scroll', x: 50, y: 100 } as any;
    expect(explainMouseAciton(detail)).toBe('水平滚动 50px，垂直滚动 100px');
  });

  it('应该返回未知鼠标事件描述', () => {
    const detail = { type: 'unknown' } as any;
    expect(explainMouseAciton(detail)).toBe('未知鼠标事件');
  });
});

describe('explainTriggerAction', () => {
  it('应该返回失去焦点的事件描述', () => {
    const detail = { type: 'blur', selector: '#input' } as any;
    expect(explainTriggerAction(detail)).toBe('失去选择器 #input 的焦点');
  });

  it('应该返回拖动事件描述', () => {
    const detail = { type: 'drag', from: '#item1', to: '#item2' } as any;
    expect(explainTriggerAction(detail)).toBe(
      '拖动选择器 #item1 到选择器 #item2',
    );
  });

  it('应该返回聚焦事件描述', () => {
    const detail = { type: 'focus', selector: '#search' } as any;
    expect(explainTriggerAction(detail)).toBe('聚焦选择器 #search');
  });

  it('应该返回悬停事件描述', () => {
    const detail = { type: 'hover', selector: '.menu' } as any;
    expect(explainTriggerAction(detail)).toBe('悬停在选择器 .menu 上');
  });

  it('应该返回输入文本的事件描述', () => {
    const detail = {
      type: 'input',
      selector: '#textarea',
      value: '测试内容',
    } as any;
    expect(explainTriggerAction(detail)).toBe(
      '在选择器 #textarea 输入文本：测试内容',
    );
  });

  it('应该返回等待时间的事件描述', () => {
    const detail = { type: 'wait', time: 500 } as any;
    expect(explainTriggerAction(detail)).toBe('等待 500 毫秒');
  });

  it('应该返回未知触发事件描述', () => {
    const detail = { type: 'unknown' } as any;
    expect(explainTriggerAction(detail)).toBe('未知触发事件');
  });
});
