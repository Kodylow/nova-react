/**
 * Copyright 2026 Visa.
 * Licensed under the Apache License, Version 2.0.
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global Buffer, process */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { isIP } from 'node:net';
import { extname } from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';

const root = new URL('../preview/', import.meta.url);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};
let host = '0.0.0.0';
let port = process.env.PORT || '3000';
for (let i = 2; i < process.argv.length; i += 2) {
  const flag = process.argv[i];
  const value = process.argv[i + 1];
  if (flag === '--help') {
    console.log('Usage: node bin/serve-preview.mjs [--host ADDRESS] [--port PORT]');
    process.exit(0);
  }
  if (!value || !['--host', '--port'].includes(flag)) throw new Error(`Invalid argument: ${flag}`);
  if (flag === '--host') host = value;
  else port = value;
}
if (!/^\d+$/.test(port) || +port < 1 || +port > 65535) throw new Error('Port must be 1–65535.');

const archive = readFileSync(new URL('workshop.tar.gz', root));
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
if (createHash('sha256').update(archive).digest('hex') !== manifest.archiveSha256) {
  throw new Error('Preview checksum mismatch. Restore the snapshot or run pnpm preview:build.');
}
const tar = gunzipSync(archive);
const files = new Map();
for (let offset = 0; offset + 512 <= tar.length; ) {
  const header = tar.subarray(offset, offset + 512);
  if (header.every(byte => byte === 0)) break;
  const field = (start, length) =>
    header
      .subarray(start, start + length)
      .toString()
      .replace(/\0.*$/s, '');
  const octal = value => (/^[0-7]+$/.test(value.trim()) ? parseInt(value.trim(), 8) : NaN);
  const checksum = header.reduce((sum, byte, i) => sum + (i >= 148 && i < 156 ? 32 : byte), 0);
  if (octal(field(148, 8)) !== checksum) throw new Error('Invalid preview tar checksum.');
  const prefix = field(345, 155);
  const name = (prefix ? `${prefix}/` : '') + field(0, 100);
  const size = octal(field(124, 12));
  if (
    !name ||
    name.startsWith('/') ||
    name.split('/').some(part => ['..', '.', ''].includes(part)) ||
    name.includes('\\') ||
    !Number.isSafeInteger(size) ||
    size < 0 ||
    offset + 512 + size > tar.length ||
    !['0', ''].includes(field(156, 1)) ||
    files.has(name)
  ) {
    throw new Error(`Invalid preview archive entry: ${name}`);
  }
  files.set(name, tar.subarray(offset + 512, offset + 512 + size));
  offset += 512 + Math.ceil(size / 512) * 512;
}
if (!files.has('index.html')) throw new Error('Preview archive has no index.html.');

const compressed = new Map();
function allowedHost(value) {
  if (!value || /[\\/@?#\s]/.test(value)) return false;
  try {
    const hostname = new URL(`http://${value}`).hostname.toLowerCase();
    return (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      Boolean(isIP(hostname.replace(/^\[|\]$/g, ''))) ||
      hostname.endsWith('.replit.dev') ||
      hostname.endsWith('.repl.co') ||
      hostname === (process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS || '').toLowerCase()
    );
  } catch {
    return false;
  }
}
const server = createServer((request, response) => {
  const end = (status, body, headers = {}) => {
    const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body);
    response.writeHead(status, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': bytes.length,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
      ...headers,
    });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  };
  if (!allowedHost(request.headers.host)) return end(403, 'Host is not allowed.');
  if (!['GET', 'HEAD'].includes(request.method)) return end(405, 'Method not allowed.', { Allow: 'GET, HEAD' });
  let path;
  try {
    path = decodeURIComponent(request.url.split('?')[0]);
  } catch {
    return end(400, 'Malformed URL.');
  }
  if (path.includes('\\') || [...path].some(char => char.charCodeAt(0) < 32) || path.split('/').includes('..')) {
    return end(400, 'Invalid path.');
  }
  if (path === '/' || path === '/react') return end(302, '', { Location: '/react/' });
  if (!path.startsWith('/react/')) return end(404, 'Not found.');
  let name = path.slice('/react/'.length) || 'index.html';
  if (!files.has(name)) {
    if (name.startsWith('assets/') || extname(name)) return end(404, 'Not found.');
    name = 'index.html';
  }
  let body = files.get(name);
  const type = types[extname(name)] || 'application/octet-stream';
  const headers = {
    'Content-Type': type,
    Vary: 'Accept-Encoding',
    'Cache-Control': /^assets\/.+-[\w-]{8,}\.[\w]+$/.test(name) ? 'public, max-age=31536000, immutable' : 'no-cache',
  };
  const gzipAccepted = (request.headers['accept-encoding'] || '')
    .split(',')
    .some(token => /^gzip(?:\s*;.*)?$/i.test(token.trim()) && !/;\s*q=0(?:\.0*)?\s*$/i.test(token.trim()));
  if (gzipAccepted && body.length > 512 && /^(text\/|application\/json|image\/svg)/.test(type)) {
    if (!compressed.has(name)) compressed.set(name, gzipSync(body));
    body = compressed.get(name);
    headers['Content-Encoding'] = 'gzip';
  }
  end(200, body, headers);
});
server.on('error', error => {
  console.error(`Preview failed: ${error.message}`);
  process.exit(1);
});
server.listen(+port, host, () => {
  console.log(`Snapshot preview ready: http://localhost:${port}/react/`);
  console.log('No dependencies installed. For source edits and live reload: bash run.sh --dev');
});
