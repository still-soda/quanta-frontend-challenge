import { resolveDoc } from '../resolve-doc.utils';

/**
 * 压平字符串
 * @param content 字符串数组
 * @returns 压平后的字符串
 */
function flat(content: TemplateStringsArray) {
   return content
      .join('')
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
}

describe('ResolveDoc', () => {
   it('应该正确解析文档', () => {
      const content = flat`
        :::description
        this is a description
        ::::
        
        :::images
        this is a images
        ::::
        `;

      const doc = resolveDoc(content);
      expect(doc).toEqual({
         description: 'this is a description',
         images: 'this is a images',
      });
   });

   it('应该正确解析扩展字段', () => {
      const content = flat`
          :::description
          this is a description
          ::::
          
          :::images
          this is a images
          ::::
          
          :::extend
          this is a extend
          ::::
          `;

      const doc = resolveDoc(content, ['extend']);
      expect(doc).toEqual({
         description: 'this is a description',
         images: 'this is a images',
         extend: 'this is a extend',
      });
   });
});
