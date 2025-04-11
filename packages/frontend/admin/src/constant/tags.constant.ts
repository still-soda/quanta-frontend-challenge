/**
 * 标签颜色映射
 * @example
 * ```ts
 * TAG_COLOR_MAPPING['css'] // #60A5FA
 * ```
 */
export const TAG_COLOR_MAPPING: Readonly<Record<string, string>> =
   Object.freeze({
      // 语言
      css: '#60A5FA',
      javascript: '#FF9232',
      html: '#FF6565',
      typescript: '#60A5FA',
      vue: '#94B889',
      react: '#60A5FA',

      // 难度
      easy: '#60A5FA',
      medium: '#FF9232',
      hard: '#FF6565',
   });

/**
 * 标签文本映射
 * @example
 * ```ts
 * TAG_TEXT_MAPPING['css'] // 'CSS'
 * TAG_TEXT_MAPPING['eazy'] // '简单'
 * ```
 */
export const TAG_TEXT_MAPPING: Readonly<Record<string, string>> = Object.freeze(
   {
      // 语言
      css: 'CSS',
      javascript: 'JavaScript',
      html: 'HTML',
      typescript: 'TypeScript',
      vue: 'Vue',
      react: 'React',

      // 难度
      easy: '简单',
      medium: '中等',
      hard: '困难',
   }
);

/**
 * 状态颜色映射
 * @example
 * ```ts
 * STATUS_COLOR_MAPPING[0] // '#FF9232'
 * ```
 */
export const STATUS_COLOR_MAPPING: Readonly<string[]> = Object.freeze([
   '#FF9232',
   '#60A5FA',
   '#94B889',
   '#FF6565',
]);

/**
 * 状态文本映射
 * @example
 * ```ts
 * STATUS_TEXT_MAPPING[0] // '草稿中'
 * ```
 */
export const STATUS_TEXT_MAPPING: Readonly<string[]> = Object.freeze([
   '草稿中',
   '准备中',
   '已发布',
   '已关闭',
]);
