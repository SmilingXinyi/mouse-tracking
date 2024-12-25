// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'MouseTracking',
      fileName: (format) => `mt.${format}.js`,
      // 你可以根据需要选择不同的模块格式，如 'es', 'cjs', 'umd'
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // 如果你的库有外部依赖，可以在这里配置
      external: [],
      output: {
        // 全局变量名，用于 UMD 构建
        globals: {},
      },
    },
  },
});
