import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [vue() as any],
   resolve: {
      alias: {
         '@': resolve(__dirname, './src'),
      },
   },
});
