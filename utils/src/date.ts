/**
 * 根据年月日时分秒生成 Date 对象
 * @param options 生成 Date 对象的参数
 * @example
 * ```typescript
 * plainDate({ year: 2021, month: 1, day: 1 });                         // => 2021-01-01 00:00:00
 * plainDate({ year: 2021, month: 1, day: 1, hour: 12, minute: 30 });   // => 2021-01-01 12:30:00
 * ```
 */
export function plainDate(options: {
   year: number;
   month: number;
   day: number;
   hour?: number;
   minute?: number;
   second?: number;
}): Date {
   return new Date(
      options.year,
      options.month - 1,
      options.day,
      options.hour || 0,
      options.minute || 0,
      options.second || 0
   );
}

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
export function shiftDate(
   date: Date,
   offset: {
      years?: number;
      months?: number;
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
   }
): Date {
   return new Date(
      date.getFullYear() + (offset.years || 0),
      date.getMonth() + (offset.months || 0),
      date.getDate() + (offset.days || 0),
      date.getHours() + (offset.hours || 0),
      date.getMinutes() + (offset.minutes || 0),
      date.getSeconds() + (offset.seconds || 0)
   );
}

/**
 * 将 Date 对象转换为对象
 * @param date Date 对象
 * @returns 对象
 * @example
 * ```typescript
 * pipeObject(new Date());  // => { year: 2021, month: 1, day: 1, hour: 12, minute: 30, second: 0 }
 * ```
 */
export function dateToObject(date: Date) {
   return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
   };
}
