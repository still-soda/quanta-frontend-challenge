declare module '@challenge/utils' {
   declare class EventEmitter {
      private listeners;
      /**
       * 监听事件
       * @param event 事件名称
       * @param listener 触发事件时的回调
       */
      on(event: string, listener: Function): void;
      /**
       * 取消监听事件
       * @param event 事件名称
       * @param listener 触发事件时的回调
       */
      off(event: string, listener: Function): void;
      /**
       * 触发事件
       * @param event 事件名称
       * @param args 传递的参数
       */
      emit(event: string, ...args: any[]): void;
   }
   export declare const INJECT_KEY: unique symbol;
   /**
    * 创建事件发射器
    */
   export declare function createEventEmitter(): EventEmitter;
   /**
    * 注入事件发射器
    */
   export declare function useEventEmitter(key?: symbol): EventEmitter;
   export {};

   /**
    * 用于创建一个链式比较器，用于实现多级排序
    * @example
    * ```typescript
    * const chain = new CompareChain<T>();
    * chain
    *    .then((a, b) => a.name - b.name) // 先按 name 升序
    *    .then((a, b) => b.age - a.age);  // 再按 age 降序
    * const sorted = chain.toSort(array);
    * ```
    */
   export declare class CompareChain<T> {
      private chain;
      /**
       * 添加一个比较函数到链中
       * @param fn 比较函数
       * @example
       * ```typescript
       * chain
       *    .then((a, b) => a.name - b.name) // 先按 name 升序
       *    .then((a, b) => b.age - a.age);  // 再按 age 降序
       * ```
       */
      toCompare(fn: (a: T, b: T) => number): CompareChain<T>;
      /**
       * 重置比较链
       */
      reset(): CompareChain<T>;
      /**
       * 对数组进行排序
       * @param array 要排序的数组
       * @returns 排序后的数组
       * @example
       * ```typescript
       * const sorted = chain.toSort(array);
       * ```
       */
      toSort(array: T[]): T[];
      /**
       * 比较两个对象
       * @param a 对象a
       * @param b 对象b
       * @returns 比较结果
       * @example
       * ```typescript
       * // 直接比较
       * const result = chain.compare(a, b);
       * // 或者应用于数组排序
       * const sorted = array.sort(chain.compare.bind(chain));
       * ```
       */
      compare(a: T, b: T): number;
   }

   /**
    * @overload
    * 产生一个从 0 到 count - 1 的数组
    * @param count 数组长度
    * @example range(3) => [0, 1, 2]
    *
    * @overload
    * 产生一个从 start 到 end - 1 的数组
    * @param start 数组起始值
    * @param end 数组结束值
    * @example range(1, 4) => [1, 2, 3]
    */
   declare function range(count: number): number[];
   declare function range(start: number, end?: number): number[];
   export { range };

   /**
    * 将字符串转换为像素，支持转化 `rem` 和 `px` 单位
    * @author still-soda
    * @param value 值
    * @example
    * ```typescript
    * parseToPixels('1rem')   // 16
    * parseToPixels('16px')   // 16
    * parseToPixels('1')      // 1
    * ```
    */
   declare function parseToPixels(value: string): number;
   export { parseToPixels };

   /**
    * 根据年月日时分秒生成 Date 对象
    * @param options 生成 Date 对象的参数
    * @example
    * ```typescript
    * plainDate({ year: 2021, month: 1, day: 1 });                         // => 2021-01-01 00:00:00
    * plainDate({ year: 2021, month: 1, day: 1, hour: 12, minute: 30 });   // => 2021-01-01 12:30:00
    * ```
    */
   export declare function plainDate(options: {
      year: number;
      month: number;
      day: number;
      hour?: number;
      minute?: number;
      second?: number;
   }): Date;
   /**
    * 相对日期偏移
    * @param date 偏移的日期
    * @param offset 偏移量
    * @returns 偏移后的日期
    * @example
    * ```typescript
    * dateOffset(new Date(), { days: 1 });     // 明天
    * dateOffset(new Date(), { days: -1 });    // 昨天
    * dateOffset(new Date(), { months: 1 });   // 下个月
    * dateOffset(new Date(), { months: -1 });  // 上个月
    * ```
    */
   export declare function shiftDate(
      date: Date,
      offset: {
         years?: number;
         months?: number;
         days?: number;
         hours?: number;
         minutes?: number;
         seconds?: number;
      }
   ): Date;
   /**
    * 将 Date 对象转换为对象
    * @param date Date 对象
    * @returns 对象
    * @example
    * ```typescript
    * pipeObject(new Date());  // => { year: 2021, month: 1, day: 1, hour: 12, minute: 30, second: 0 }
    * ```
    */
   export declare function dateToObject(date: Date): {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      second: number;
   };
}
