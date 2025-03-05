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
}
