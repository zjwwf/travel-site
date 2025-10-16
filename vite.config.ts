import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: { port: 5173 },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts', 'mcp-server/**/*.test.js']
  }
});