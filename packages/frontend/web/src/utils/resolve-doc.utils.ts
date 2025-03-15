/**
 * 默认解析结果
 */
export interface DefaultResolveResult {
   description: string;
   images: string;
}

/**
 * 解析文档
 * @param content 文档内容
 * @param extendKeys 扩展键
 * @returns 解析结果
 */
export function resolveDoc<T extends Record<string, string>>(
   content: string,
   extendKeys: string[] = []
): DefaultResolveResult & T {
   const result: Record<string, string> = {};
   const keys = ['description', 'images', ...extendKeys];
   const regexs = keys.map(
      (key) => new RegExp(`:::${key}([\\s\\S]*?):::`, 'g')
   );

   keys.forEach((key, index) => {
      const regex = regexs[index];
      const match = content.match(regex);
      if (match) {
         result[key] = match[0].replace(regex, '$1').trim();
      }
   });

   return result as DefaultResolveResult & T;
}
