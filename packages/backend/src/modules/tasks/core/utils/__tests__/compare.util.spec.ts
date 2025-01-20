import { compareValue } from '../compare.util';

describe('Compare Value', () => {
  describe('比较属性', () => {
    it('应该正确比较两个属性值 - 相等', () => {
      const obj = { a: 1 };
      const obj2 = { a: 1 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'eq',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 相等但是实际不相等', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'eq',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 为 2，实际值为 1',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 不相等', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'ne',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 不相等但是实际相等', () => {
      const obj = { a: 1 };
      const obj2 = { a: 1 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'ne',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 不为 1，实际值为 1',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 大于', () => {
      const obj = { a: 2 };
      const obj2 = { a: 1 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'gt',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 小于但是实际大于', () => {
      const obj = { a: 2 };
      const obj2 = { a: 3 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'gt',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 大于 3，实际值为 2',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 小于', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'lt',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 大于但是实际小于', () => {
      const obj = { a: 3 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'lt',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 小于 2，实际值为 3',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 大于等于', () => {
      const obj = { a: 2 };
      const obj2 = { a: 1 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'gte',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 大于等于但是实际小于', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'gte',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 大于等于 2，实际值为 1',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 小于等于', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'lte',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 小于等于但是实际大于', () => {
      const obj = { a: 2 };
      const obj2 = { a: 1 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'lte',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 小于等于 1，实际值为 2',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 未知操作符', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'unknown' as any,
      });
      expect(result).toEqual({
        msg: '未知操作符 unknown',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 包含', () => {
      const obj = { a: 'hello world' };
      const obj2 = { a: 'hello' };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'contains',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 包含但是实际不包含', () => {
      const obj = { a: 'hello world' };
      const obj2 = { a: 'word' };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'contains',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 包含 word，实际值为 hello world',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 实际值不是字符串', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'contains',
      });
      expect(result).toEqual({
        msg: '实际值不是字符串',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 不包含', () => {
      const obj = { a: 'hello world' };
      const obj2 = { a: 'word' };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'notContains',
      });
      expect(result).toEqual({
        msg: 'ok',
        val: true,
      });
    });

    it('应该正确比较两个属性值 - 不包含但是实际包含', () => {
      const obj = { a: 'hello world' };
      const obj2 = { a: 'hello' };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'notContains',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的属性 a 不包含 hello，实际值为 hello world',
        val: false,
      });
    });

    it('应该正确比较两个属性值 - 不包含但是实际值不是字符串', () => {
      const obj = { a: 1 };
      const obj2 = { a: 2 };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '属性',
        key: 'a',
        selector: '#test',
        operator: 'notContains',
      });
      expect(result).toEqual({
        msg: '实际值不是字符串',
        val: false,
      });
    });
  });

  describe('比较文本', () => {
    it('应该正确比较两个文本值 - 相等但是实际不相等', () => {
      const obj = { a: 'hello' };
      const obj2 = { a: 'world' };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '文本',
        selector: '#test',
        operator: 'eq',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的文本为 world，实际值为 hello',
        val: false,
      });
    });

    it('应该正确比较两个文本值 - 不相等但是实际相等', () => {
      const obj = { a: 'hello' };
      const obj2 = { a: 'hello' };
      const result = compareValue({
        actual: obj.a,
        expected: obj2.a,
        type: '文本',
        selector: '#test',
        operator: 'ne',
      });
      expect(result).toEqual({
        msg: '期望选择器 #test 的文本不为 hello，实际值为 hello',
        val: false,
      });
    });
  });
});
