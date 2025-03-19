import { Plugin } from 'vite';

/**
 * 这个插件用于在打包时，将所有的 index.ts 文件的导出路径加上 .js 后缀
 */
export default function addJsExtensionPlugin(): Plugin {
   return {
      name: 'add-js-extension',
      generateBundle(_, bundle) {
         Object.values(bundle).forEach((chunk: any) => {
            if (chunk.fileName.endsWith('.d.ts') && chunk.source) {
               chunk.source = addJsExtension(chunk.source);
            }
         });
      },
   };
}

function addJsExtension(code: string): string {
   const transformed = code.replace(/export \* from '(.+)';/g, (match, p1) => {
      return p1.endsWith('.js') ? match : `export * from '${p1}.js';`;
   });
   return transformed;
}
