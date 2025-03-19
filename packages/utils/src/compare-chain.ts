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
export class CompareChain<T> {
   private chain: Array<(a: T, b: T) => number> = [];

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
   public toCompare(fn: (a: T, b: T) => number): CompareChain<T> {
      this.chain.push(fn);
      return this;
   }

   /**
    * 重置比较链
    */
   public reset(): CompareChain<T> {
      this.chain = [];
      return this;
   }

   /**
    * 对数组进行排序
    * @param array 要排序的数组
    * @returns 排序后的数组
    * @example
    * ```typescript
    * const sorted = chain.toSort(array);
    * ```
    */
   public toSort(array: T[]): T[] {
      return array.sort(this.compare.bind(this));
   }

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
   public compare(a: T, b: T): number {
      for (const fn of this.chain) {
         const result = fn(a, b);
         if (result !== 0) {
            return result;
         }
      }
      return 0;
   }
}
