/**
 *              © 2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
/* global process */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const generator = join(root, 'apps/workshop/bin/stat-gen.mjs');
const fixture = t => {
  const path = mkdtempSync(join(tmpdir(), 'nova-startup-check-'));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
};
const write = (path, contents) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
};

test('generation preserves custom metadata, discovers new examples, and leaves unchanged files untouched', t => {
  const path = fixture(t);
  const workshop = join(path, 'apps/workshop');
  const metadataPath = join(workshop, 'src/examples/components/button/meta.json');
  write(join(workshop, 'src/examples/components/button/primary.tsx'), '');
  write(join(workshop, 'src/examples/components/button/secondary.tsx'), '');
  write(join(workshop, 'src/examples/components/button/index.test.tsx'), '');
  write(join(workshop, 'src/examples/components/button/index.tsx'), '');
  write(metadataPath, JSON.stringify({ primary: { title: 'Keep this title', custom: true } }));
  write(join(path, 'libs/nova-react/src/button/index.tsx'), '');
  write(join(path, 'libs/nova-react/src/use-example/index.ts'), '');
  const generate = () => {
    const result = spawnSync(process.execPath, [generator], { cwd: workshop, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  };
  generate();
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  assert.deepEqual(metadata.primary, { title: 'Keep this title', custom: true, file: 'primary.tsx', id: 'primary' });
  assert.deepEqual(metadata.secondary, { file: 'secondary.tsx', id: 'secondary' });
  assert.equal(Object.keys(metadata).length, 2);
  const statsPath = join(workshop, 'src/examples/meta.json');
  const stats = JSON.parse(readFileSync(statsPath, 'utf8'));
  assert.deepEqual(stats.stats, { components: 1, examples: 2, hooks: 1 });
  assert.deepEqual(stats.components, ['button']);
  const mtimes = [metadataPath, statsPath].map(file => statSync(file, { bigint: true }).mtimeNs);
  generate();
  assert.deepEqual(
    [metadataPath, statsPath].map(file => statSync(file, { bigint: true }).mtimeNs),
    mtimes
  );
  write(join(workshop, 'src/examples/components/button/new-example.tsx'), '');
  generate();
  assert.equal(JSON.parse(readFileSync(metadataPath, 'utf8'))['new-example'].file, 'new-example.tsx');
  assert.equal(JSON.parse(readFileSync(statsPath, 'utf8')).stats.examples, 3);
});

test('launcher resolves pnpm once, keeps frozen install and lifecycle scripts, and forwards arguments', t => {
  const path = fixture(t);
  const tools = join(path, 'tools');
  mkdirSync(tools);
  const executable = (name, body) => writeFileSync(join(tools, name), `#!/bin/bash\n${body}\n`, { mode: 0o755 });
  executable('node', 'exit 0');
  executable('npm', 'echo npm >>"$TRACE"\nshift 4\nexec "$@"');
  executable(
    'pnpm',
    'printf "<%s>" "$@" >>"$TRACE"\nprintf "\\n" >>"$TRACE"\nif [ "$1" = install ] && [ "${FAIL_INSTALL:-0}" = 1 ]; then exit 42; fi'
  );
  const trace = join(path, 'trace');
  const env = { ...process.env, PATH: `${tools}:${process.env.PATH}`, TRACE: trace };
  const args = [join(root, 'run.sh'), '--dev', '--port', '3137', '--base', '/with spaces/'];
  const result = spawnSync('/bin/bash', args, { env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    readFileSync(trace, 'utf8'),
    'npm\n<install><--frozen-lockfile>\n<--dir><apps/workshop><run><dev><--port><3137><--base></with spaces/>\n'
  );
  writeFileSync(trace, '');
  const failure = spawnSync('/bin/bash', args, { env: { ...env, FAIL_INSTALL: '1' }, encoding: 'utf8' });
  assert.equal(failure.status, 42);
  assert.equal(readFileSync(trace, 'utf8'), 'npm\n<install><--frozen-lockfile>\n');
});
