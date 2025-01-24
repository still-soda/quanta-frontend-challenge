import {
  explainExpectTestpointAction,
  explainScreenShotTestpointAction,
  explainScreenShotTestpointPreAction,
} from '../testpoints/testpoints.explainer';

describe('explainExpectTestpointAction', () => {
  it('应该返回带属性和比较符的期望测试点描述', () => {
    const detail = {
      name: '测试点1',
      score: 10,
      compare: 'eq',
      selector: '#element',
      attr: 'value',
      value: '测试值',
      typeParser: 'string',
    } as any;
    expect(explainExpectTestpointAction(detail)).toBe(
      '[测试点1: 10分]: 期望选择器 #element 的属性 value 等于 测试值 (类型转换：string)',
    );
  });

  it('应该返回带文本和比较符的期望测试点描述', () => {
    const detail = {
      name: '测试点2',
      score: 20,
      compare: 'ne',
      selector: '.text',
      text: '示例文本',
    } as any;
    expect(explainExpectTestpointAction(detail)).toBe(
      '[测试点2: 20分]: 期望选择器 .text 的文本不等于 示例文本 ',
    );
  });

  it('应该返回存在的期望测试点描述', () => {
    const detail = {
      name: '测试点3',
      score: 15,
      compare: 'gt',
      selector: '#exists',
      exist: true,
    } as any;
    expect(explainExpectTestpointAction(detail)).toBe(
      '[测试点3: 15分]: 期望选择器 #exists 存在 ',
    );
  });

  it('应该返回不存在的期望测试点描述', () => {
    const detail = {
      name: '测试点4',
      score: 5,
      compare: 'lt',
      selector: '.hidden',
      exist: false,
    } as any;
    expect(explainExpectTestpointAction(detail)).toBe(
      '[测试点4: 5分]: 期望选择器 .hidden 不存在 ',
    );
  });

  it('应该返回带类型转换的期望测试点描述', () => {
    const detail = {
      name: '测试点5',
      score: 25,
      compare: 'gte',
      selector: '#number',
      attr: 'data-count',
      value: 100,
      typeParser: 'number',
    } as any;
    expect(explainExpectTestpointAction(detail)).toBe(
      '[测试点5: 25分]: 期望选择器 #number 的属性 data-count 大于等于 100 (类型转换：number)',
    );
  });

  it('应该返回未知期望测试点描述', () => {
    const detail = {
      name: '测试点6',
      score: 0,
      compare: 'unknown',
      selector: '#unknown',
    } as any;
    expect(explainExpectTestpointAction(detail)).toBe(
      '[测试点6: 0分]: 未知期望测试点',
    );
  });
});

describe('explainScreenShotTestpointAction', () => {
  it('应该返回截图比对的测试点描述', () => {
    const detail = {
      name: '截图测试点1',
      score: 30,
      root: '#screenshot',
    } as any;
    expect(explainScreenShotTestpointAction(detail)).toBe(
      '[截图测试点1: 30分]: 截图选择器 #screenshot 进行比对',
    );
  });
});

describe('explainScreenShotTestpointPreAction', () => {
  it('应该返回生成截图的预处理测试点描述', () => {
    const detail = {
      name: '截图预处理测试点1',
      score: 20,
      root: '.screenshot-root',
    } as any;
    expect(explainScreenShotTestpointPreAction(detail)).toBe(
      '[截图预处理测试点1: 20分]: 生成选择器 .screenshot-root 的截图',
    );
  });
});
