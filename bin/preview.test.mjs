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
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { gunzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const runtimes = [{ name: 'Node', command: process.execPath, file: 'serve-preview.mjs' }];
if (spawnSync('python3', ['--version']).status === 0) {
  runtimes.push({ name: 'Python', command: 'python3', file: 'serve-preview.py' });
}
function get(port, path, headers = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path, headers, method }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () =>
        resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) })
      );
    });
    req.on('error', reject);
    req.setTimeout(2000, () => req.destroy(new Error('HTTP timeout')));
    req.end();
  });
}
async function freePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
function launch(runtime, directory, port) {
  const child = spawn(
    runtime.command,
    [join(directory, 'bin', runtime.file), '--host', '127.0.0.1', '--port', String(port)],
    {
      env: { ...process.env, HOME: directory, __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: 'preview.example.test' },
    }
  );
  let output = '';
  child.stdout.on('data', data => {
    output += data;
  });
  child.stderr.on('data', data => {
    output += data;
  });
  return { child, output: () => output };
}
async function waitExit(child) {
  if (child.exitCode !== null) return child.exitCode;
  let timer;
  try {
    return await Promise.race([
      once(child, 'exit').then(([code]) => code),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          child.kill();
          reject(new Error('Process failed to exit.'));
        }, 5000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

for (const runtime of runtimes) {
  test(`${runtime.name}: zero-install preview, routes, compression, security, strict ports and corrupt archives`, async t => {
    const directory = mkdtempSync(join(tmpdir(), 'nova-preview-test-'));
    mkdirSync(join(directory, 'bin'));
    // Only the server and snapshot: no source tree, node_modules, npm cache, or git.
    cpSync(join(root, 'bin', runtime.file), join(directory, 'bin', runtime.file));
    cpSync(join(root, 'preview'), join(directory, 'preview'), { recursive: true });
    const port = await freePort();
    const { child, output } = launch(runtime, directory, port);
    t.after(() => {
      child.kill();
      rmSync(directory, { recursive: true, force: true });
    });
    const deadline = Date.now() + 5000;
    let home;
    while (Date.now() < deadline) {
      assert.equal(child.exitCode, null, output());
      try {
        home = await get(port, '/react/');
        break;
      } catch {
        await delay(25);
      }
    }
    assert.ok(home, output());
    assert.equal(home.status, 200);
    assert.match(home.body.toString(), /<title>VPDS Nova/);
    assert.match(home.headers['cache-control'], /no-cache/);
    assert.equal((await get(port, '/')).headers.location, '/react/');
    assert.equal((await get(port, '/react')).status, 302);
    assert.equal((await get(port, '/react/components/button')).body.toString(), home.body.toString());
    assert.equal((await get(port, '/react/assets/no-such-file.js')).status, 404);
    assert.equal((await get(port, '/react/missing.json')).status, 404);
    assert.equal((await get(port, '/README.md')).status, 404);
    assert.equal((await get(port, '/react/%2e%2e/README.md')).status, 400);
    assert.equal((await get(port, '/react/%5c..%5cREADME.md')).status, 400);
    assert.equal((await get(port, '/react/%00')).status, 400);
    assert.equal((await get(port, '/react/%zz')).status, 400);
    assert.equal((await get(port, '/react/', { Host: 'evil.example' })).status, 403);
    assert.equal((await get(port, '/react/', { Host: 'example.replit.dev.evil.example' })).status, 403);
    assert.equal((await get(port, '/react/', { Host: 'test.replit.dev' })).status, 200);
    assert.equal((await get(port, '/react/', { Host: 'preview.example.test' })).status, 200);
    assert.equal((await get(port, '/react/', {}, 'HEAD')).body.length, 0);
    assert.equal((await get(port, '/react/', {}, 'POST')).status, 405);
    const assetPath = home.body.toString().match(/src="([^"]+\.js)"/)[1];
    const plain = await get(port, assetPath);
    assert.equal(plain.status, 200);
    assert.match(plain.headers['content-type'], /javascript/);
    assert.match(plain.headers['cache-control'], /immutable/);
    const zipped = await get(port, assetPath, { 'Accept-Encoding': 'gzip' });
    assert.equal(zipped.headers['content-encoding'], 'gzip');
    assert.deepEqual(gunzipSync(zipped.body), plain.body);
    assert.ok(zipped.body.length < plain.body.length);
    assert.equal(
      (await get(port, assetPath, { 'Accept-Encoding': 'gzip;q=0' })).headers['content-encoding'],
      undefined
    );
    const collision = launch(runtime, directory, port);
    assert.notEqual(await waitExit(collision.child), 0);
    assert.match(collision.output(), /in use|EADDRINUSE/i);
    child.kill();
    await waitExit(child);
    const archivePath = join(directory, 'preview/workshop.tar.gz');
    const archive = readFileSync(archivePath);
    archive[10] ^= 1;
    writeFileSync(archivePath, archive);
    const corrupt = launch(runtime, directory, port);
    assert.notEqual(await waitExit(corrupt.child), 0);
    assert.match(corrupt.output(), /checksum mismatch/);
  });
}

test('snapshot freshness check detects source edits and new untracked source files', t => {
  const directory = mkdtempSync(join(tmpdir(), 'nova-preview-freshness-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const sub of ['bin', 'preview', 'apps/workshop/src']) mkdirSync(join(directory, sub), { recursive: true });
  cpSync(join(root, 'bin/package-preview.mjs'), join(directory, 'bin/package-preview.mjs'));
  assert.equal(spawnSync('git', ['init', '-q', directory]).status, 0);
  const sha = value => createHash('sha256').update(value).digest('hex');
  writeFileSync(join(directory, 'package.json'), '{}');
  writeFileSync(join(directory, 'apps/workshop/src/example.ts'), 'original');
  writeFileSync(join(directory, 'preview/workshop.tar.gz'), 'fixture');
  writeFileSync(
    join(directory, 'preview/manifest.json'),
    JSON.stringify({
      archiveSha256: sha('fixture'),
      sources: { 'apps/workshop/src/example.ts': sha('original'), 'package.json': sha('{}') },
    })
  );
  const check = () =>
    spawnSync(process.execPath, [join(directory, 'bin/package-preview.mjs'), '--check'], { encoding: 'utf8' });
  assert.equal(check().status, 0);
  writeFileSync(join(directory, 'apps/workshop/src/example.ts'), 'changed');
  assert.notEqual(check().status, 0);
  writeFileSync(join(directory, 'apps/workshop/src/example.ts'), 'original');
  writeFileSync(join(directory, 'apps/workshop/src/new.ts'), 'new');
  const result = check();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /stale or corrupt/);
});
