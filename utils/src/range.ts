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
function range(count: number): number[];
function range(start: number, end?: number): number[];
function range(param1: number, param2?: number): number[] {
   const start = param2 !== undefined ? param1 : 0;
   const end = param2 !== undefined ? param2 : param1;

   return Array.from({ length: end - start }, (_, i) => start + i);
}

export { range };
