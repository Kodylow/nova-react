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
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  base: packageJson.homepage === '/' ? '' : packageJson.homepage.replace(/\/$/, ''),
  resolve: {
    alias: [
      {
        find: '@visa/nova-react/package.json',
        replacement: fileURLToPath(new URL('../../libs/nova-react/package.json', import.meta.url)),
      },
      {
        find: '@visa/nova-react',
        replacement: fileURLToPath(new URL('../../libs/nova-react/src', import.meta.url)),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'build',
  },
  define: {
    'import.meta.env.VERSION': JSON.stringify(packageJson.version),
  },
  server: {
    allowedHosts: ['.replit.dev', '.repl.co'],
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  plugins: [react(), svgr({ include: '**/*.svg' })],
});
