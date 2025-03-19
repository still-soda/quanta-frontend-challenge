import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import addJsExtensionPlugin from './plugins/add-js-extension.plugin';

export default defineConfig({
   plugins: [
      typescript({
         tsconfig: 'tsconfig.build.json',
         declaration: true,
         declarationDir: 'dist/types',
         exclude: ['node_modules'],
      }),
      addJsExtensionPlugin(),
   ],
   build: {
      lib: {
         entry: './index.ts',
         name: '@challenge/utils',
         fileName: (format) => `index.${format}.js`,
         formats: ['cjs', 'es'],
      },
      rollupOptions: {
         output: [
            {
               format: 'esm',
               entryFileNames: '[name].js',
               chunkFileNames: '[name].js',
               preserveModules: true,
               preserveModulesRoot: '.',
            },
            {
               format: 'cjs',
               entryFileNames: '[name].cjs',
               chunkFileNames: '[name].cjs',
               preserveModules: true,
               preserveModulesRoot: '.',
            },
         ],
      },
   },
});
