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
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const hash = data => createHash('sha256').update(data).digest('hex');
function sources() {
  const names = execFileSync(
    'git',
    [
      'ls-files',
      '--cached',
      '--others',
      '--exclude-standard',
      '-z',
      '--',
      'apps/workshop',
      'libs/nova-react',
      'package.json',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      'tsconfig.json',
    ],
    { encoding: 'utf8' }
  )
    .split('\0')
    .filter(Boolean);
  return Object.fromEntries([...new Set(names)].sort().map(name => [name, hash(readFileSync(name))]));
}
if (process.argv[2] === '--check') {
  const manifest = JSON.parse(readFileSync('preview/manifest.json', 'utf8'));
  if (
    hash(readFileSync('preview/workshop.tar.gz')) !== manifest.archiveSha256 ||
    JSON.stringify(sources()) !== JSON.stringify(manifest.sources)
  ) {
    throw new Error(
      'Preview is stale or corrupt. Run pnpm preview:build and commit preview/ with your source changes.'
    );
  }
  console.log('Preview matches current source files and passes its archive checksum.');
  process.exit(0);
}
if (process.argv.length > 2) throw new Error('Usage: node bin/package-preview.mjs [--check]');
const before = sources();
// Packaging is a maintainer operation, never on the consumer startup path.
execFileSync('npm', ['exec', '--yes', '--package=pnpm@10.8.0', '--', 'pnpm', 'build:docs'], { stdio: 'inherit' });
if (JSON.stringify(before) !== JSON.stringify(sources())) throw new Error('Sources changed while building; rerun.');

const chunks = [];
let fileCount = 0;
function pack(directory, prefix = '') {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name, 'en')
  )) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) {
      pack(join(directory, entry.name), `${name}/`);
      continue;
    }
    if (!entry.isFile()) throw new Error(`Unsupported build entry: ${name}`);
    const data = readFileSync(join(directory, entry.name));
    const header = Buffer.alloc(512);
    const put = (value, offset, length) => {
      if (Buffer.byteLength(value) > length) throw new Error(`USTAR field too long: ${value}`);
      header.write(value, offset, length, 'utf8');
    };
    const octal = (value, length) => value.toString(8).padStart(length - 1, '0') + '\0';
    const split = name.lastIndexOf('/');
    put(Buffer.byteLength(name) <= 100 ? name : name.slice(split + 1), 0, 100);
    if (Buffer.byteLength(name) > 100) put(name.slice(0, split), 345, 155);
    put(octal(0o644, 8), 100, 8);
    put(octal(0, 8), 108, 8);
    put(octal(0, 8), 116, 8);
    put(octal(data.length, 12), 124, 12);
    put(octal(0, 12), 136, 12);
    put('        ', 148, 8);
    put('0', 156, 1);
    put('ustar\0', 257, 6);
    put('00', 263, 2);
    put(
      header
        .reduce((sum, byte) => sum + byte, 0)
        .toString(8)
        .padStart(6, '0') + '\0 ',
      148,
      8
    );
    chunks.push(header, data, Buffer.alloc((512 - (data.length % 512)) % 512));
    fileCount++;
  }
}
pack('apps/workshop/build');
chunks.push(Buffer.alloc(1024));
const archive = gzipSync(Buffer.concat(chunks), { level: 9 });
mkdirSync('preview', { recursive: true });
writeFileSync('preview/workshop.tar.gz', archive);
writeFileSync(
  'preview/manifest.json',
  JSON.stringify(
    {
      format: 1,
      archiveSha256: hash(archive),
      fileCount,
      sources: before,
    },
    null,
    2
  ) + '\n'
);
console.log(`Packaged ${fileCount} files into ${(archive.length / 1024 / 1024).toFixed(2)} MiB.`);
