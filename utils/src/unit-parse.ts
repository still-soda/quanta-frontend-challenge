/**
 * 获取根字体大小
 * @author still-soda
 */
function getRootFontSize(): number {
   return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

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
function parseToPixels(value: string): number {
   if (value.includes('rem')) {
      return parseFloat(value) * getRootFontSize();
   } else if (value.includes('px')) {
      return parseFloat(value);
   }
   return parseFloat(value);
}

export { parseToPixels };
