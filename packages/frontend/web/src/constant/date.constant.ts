/**
 * 月份对应的文本
 * @example 获取二月份文本：MONTH_TEXT[1] => '二月'
 */
const MONTH_TEXT = [
   '一月',
   '二月',
   '三月',
   '四月',
   '五月',
   '六月',
   '七月',
   '八月',
   '九月',
   '十月',
   '十一月',
   '十二月',
];

/**
 * 每个月的天数
 * @example 获取一月份天数：MONTH_DAY[0] => 31
 */
const MONTH_DAY = (() => {
   const result = [];
   const year = new Date().getFullYear();
   for (let i = 1; i <= 12; i++) {
      result.push(new Date(year, i, 0).getDate());
   }
   return result;
})();

export { MONTH_TEXT, MONTH_DAY };
