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
      html: '#FF9232',
      typescript: '#60A5FA',
      vue: '#94B889',
      react: '#60A5FA',

      // 难度
      eazy: '#60A5FA',
      medium: '#FF9232',
      hard: '#FF3332',
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
      eazy: '简单',
      medium: '中等',
      hard: '困难',
   }
);
