import { contain, fit, Optional } from '../data-structure-validator';

describe('数据验证器 - container', () => {
   it('应该正确验证包含关系', () => {
      const obj = { hello: 12, world: 20 };
      expect(contain(obj, ['hello', 'world'])).toBe(true);
   });

   it('应该正确验证不包含关系', () => {
      const obj = { hello: 12, world: 20 };
      expect(contain(obj, ['hello', 'world', '12'] as any)).toBe(true);
   });

   it('当传入数据为 undefined 或 null 的时候应该返回 false', () => {
      expect(contain(null as any, [])).toBe(false);
      expect(contain(undefined as any, [])).toBe(false);
   });
});

describe('数据验证器 - fit', () => {
   it('应该正确验证正确的类型', () => {
      const obj = {
         a: 12,
         b: 'hello',
         c: false,
         d: 'click',
         e: 'move',
         f: [],
         g: {
            a: 123,
            b: 'hello',
            c: {
               a: 123,
            },
         },
         h: 'str',
      };
      const dataStructure = {
         a: 'number',
         b: 'string',
         c: 'boolean',
         d: ['click', 'move'],
         e: (val: string) => val === 'move',
         f: Array.isArray,
         g: {
            a: 'number',
            b: 'string',
            c: {
               a: 'number',
            },
         },
         h: 'str',
      };

      const result = fit(obj, dataStructure);
      expect(result.ok).toBe(true);
   });

   it('应该正确验证错误的类型（第 1 层）', () => {
      const obj = { a: 123, b: 'hello' };
      expect(fit(obj, { a: 'string', b: 'number' }).ok).toBe(false);
   });

   it('应该正确验证错误的类型（第 n 层）', () => {
      const obj = { a: { b: 123 } };
      const result = fit(obj, { a: { b: 'string' } });
      expect(result.ok).toBe(false);
   });

   it('应该正确验证缺少相应类型的情况（第 1 层）', () => {
      const obj = { a: 12, b: 20 };
      expect(fit(obj, { a: 'number', b: 'number', c: 'string' }).ok).toBe(
         false
      );
   });

   it('应该正确验证缺少相应类型的情况（第 n 层）', () => {
      const obj = { a: 12, b: 20, c: { a: 20 } };
      const fitResult = fit(obj, {
         a: 'number',
         b: 'number',
         c: { a: 'numebr', b: 'string' },
      });
      expect(fitResult.ok).toBe(false);
   });

   it('应该正确验证可选属性（第 1 层）', () => {
      const obj = { a: 12, b: 20 };
      const fitResult = fit(obj, {
         a: 'number',
         b: 'number',
         c: Optional('number'),
      });
      expect(fitResult.ok).toBe(true);
   });

   it('应该正确验证可选属性（第 n 层）', () => {
      const obj = { a: 12, b: 20, c: { a: 20 } };
      const fitResult = fit(obj, {
         a: 'number',
         b: 'number',
         c: { a: 'number', b: Optional('string') },
      });
      expect(fitResult.ok).toBe(true);
   });

   it('能够正常抛出异常', () => {
      const obj = { a: 12, b: 20 };
      const dataStructure = {
         a: 'number',
         b: 'string',
      };
      try {
         fit(obj, dataStructure, true);
      } catch (error) {
         expect(error).toBeInstanceOf(Error);
         return;
      }
      expect(true).toBe(false);
   });
});
