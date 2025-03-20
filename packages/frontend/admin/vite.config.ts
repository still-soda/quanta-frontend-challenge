import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      vue() as any,
      '@vue/babel-plugin-jsx',
      viteMockServe({
         mockPath: 'mock',
         enable: true,
         logger: true,
      }),
   ],
   resolve: {
      alias: {
         '@': resolve(__dirname, './src'),
      },
   },
   server: {
      proxy: {
         '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
         },
      },
   },
   esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: `import { h, Fragment } from 'vue'`,
   },
});
