/**
 *              © 2025-2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **/
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // These subprocess/HTTP checks use Node's test runner, not jsdom.
    exclude: [...configDefaults.exclude, 'bin/preview.test.mjs'],
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        pretendToBeVisual: true,
      },
    },
    setupFiles: ['./apps/workshop/src/test-setup.ts'],
    pool: 'forks', // Prevent shared state between tests
    isolate: true, // Isolate each test file
    testTimeout: 10000, // Increase timeout for CI
    hookTimeout: 10000, // Increase hook timeout for CI
    coverage: {
      enabled: true,
      // provider: 'v8',
      provider: 'istanbul',
      reporter: ['cobertura', 'text', 'json', 'html', 'lcov', 'clover', 'json-summary'], 
      reportsDirectory: './coverage',
      include: [
        'apps/workshop/src/examples/**/*.{js,jsx,ts,tsx}',
        'libs/nova-react/src/**/*.{js,jsx,ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/node_modules/**',
        '**/coverage/**',
        '**/__mocks__/**',
        '**/build/**',
        '**/bin/**',
        'apps/workshop/src/components/**',
        'apps/workshop/src/hooks/**',
        'libs/nova-react/src/utils/**',
      ],
    },
    env: {
      BASE_URL: 'https://www.url.com',
    },
    // Suppress React warnings in tests
    reporters: ['verbose'],
    // Ensure proper test isolation on CI/Linux
    maxConcurrency: 1,
  }
});