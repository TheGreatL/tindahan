import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // allows using describe/it without imports
    environment: 'node', // ensures tests run in Node context
    coverage: {
      reporter: ['text', 'html']
    }
  }
});
