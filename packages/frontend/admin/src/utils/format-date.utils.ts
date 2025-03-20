/**
 * 格式化日期时间
 * @param dateTime 日期时间字符串
 * @returns 格式化后的日期时间字符串
 * @example
 * ```ts
 * formatDateTime('2021-08-01T12:00:00.000Z') // '2021-08-01 12:00:00'
 * ```
 */
export function formatDateTime(dateTime: string) {
   return dateTime.split('.').shift()!.replace('T', ' ');
}
