# Startup audit

## Instant snapshot preview (current default)

`bash run.sh` and `npm start` now serve a checked-in, compressed production
workshop. No dependency installation or compilation is needed to browse examples.
`bash run.sh --dev` retains the source-first live-reload workflow described below.

The snapshot is 2.61 MiB, plus a roughly 205 KiB source/checksum manifest. Servers
use only Node 18+ or Python 3 standard libraries and never extract files onto disk.
When neither runtime exists, `run.sh` still bootstraps Node (requires a downloader).
The archive checksum is checked at startup. Source freshness is checked separately
with `pnpm preview:check`; after edits use `pnpm preview:build` and commit `preview/`.

### Measured clean-copy startup

Three trials per runtime in the same Ubuntu sandbox, using copies containing
only the launcher, servers, and snapshot. Each trial had an empty HOME and a
restricted PATH with no npm, pnpm, git, downloader, or other runtime. No
node_modules or source tree was present. Node/Python themselves were already
installed; this is **not** a VM-provisioning or GitHub-download benchmark.
Filesystem/OS caches were not flushed. Chromium was already launched, but each
trial used a new browser context with no browser cache.

| Runtime | HTTP ready (three trials) | Median HTTP ready | Median rendered home |
| --- | --- | --- | --- |
| Node 22 | 175 / 156 / 150 ms | 156 ms | 507 ms |
| Python 3.13 | 251 / 199 / 188 ms | 199 ms | 548 ms |

For context, the previous fresh-VM run spent about 20 seconds in the successful
bootstrap alone, downloading Node and all 992 packages. VM provisioning, cloning,
and orchestration still take time; the preview does not make those disappear.
Prefer `git clone --depth 1` so historical snapshots do not inflate clone size.

### Verification

- Both runtimes rendered the home page, button examples, expanded example source,
  button API table, useAccordion documentation, and expanded hook source.
- The accordion actually toggled; deep-link reloads worked; zero browser page errors.
- HTTP tests cover host validation, traversal rejection, missing assets, MIME types,
  gzip, disabled gzip, HEAD, rejected writes, strict ports, and corrupt archives.
- Freshness tests reject changed source and new untracked source files.
- `npm start` served the snapshot; `bash run.sh --dev` still served Vite.
- Repository `pnpm prepush` passed: lint, library/docs builds, and all 2,054 existing
  tests across 162 files. The three standalone preview tests also passed.
- `pnpm preview:build`, `pnpm preview:check`, and `bash -n run.sh` passed.
- Docker's preview target was reviewed but not built (Docker unavailable in this VM).
- Upstream large-bundle warnings remain; they are not startup blockers.

## Previous source-first startup audit

The following describes the old default (now selected with `--dev`), not the
zero-install preview.

## Removed from the critical path

The original setup installed a system Node package, fixed Corepack permissions,
hit an unavailable private package, generated documentation, built the library,
and tried a docs build before starting Vite. The first smoke test also reused
port 3000, so it could have tested the already-running instance.

The fork now needs only `bash run.sh`:

- Use an existing supported Node, or download a user-local verified runtime.
- Install using pnpm 10.8.0 and the committed lockfile.
- Generate the small example-navigation manifest.
- Start Vite using the library source directly.

No compilation of the library, source-copy step, coverage run, or private
registry access is required. Direct component imports, API metadata, and source
views all resolve without a populated `libs/nova-react/dist`.

The downshift dependency is pinned to 9.0.4: resolving the previous range to
9.4.0 introduced incompatible test types. Production docs now typecheck and build.
The Dockerfile caches installation separately from application source and does
not run a library build. The Docker image itself was not built during this audit.

## Measured in an Ubuntu sandbox

These are observed local timings, not guarantees or a comparison against a
controlled baseline. Network speed, VM allocation and CPU availability vary.
VM provisioning and git clone time are not included.

| Scenario | HTTP ready | Home page rendered in Chromium |
| --- | --- | --- |
| Fresh checkout, Node hidden from PATH, empty pnpm store, `bash run.sh` | 24.08 s | 28.04 s |
| Existing installation, `pnpm start` | 1.73 s | 4.17 s |

The cold case downloaded and checksum-verified Node and installed all workspace
dependencies; the npm pnpm-executable cache was already present. The warm case
reused Vite's dependency cache. Render timing includes launching the test browser.

## Verification

- Fresh copies contained only the tracked `dist/package.json`, no compiled library
  and no generated navigation manifest before startup.
- Tested on separate, initially unused ports (3107–3109), not the live service.
- Chromium rendered the home page, button examples, button API properties,
  useAccordion documentation, and expanded component/hook TypeScript source.
- No browser page errors in the successful route/source checks.
- A new Replit hostname returned 200; an arbitrary untrusted hostname returned 403.
- `pnpm build:docs` passed from the clean copy.
- `pnpm prepush` (repository lint and build checks) passed.
- Button and useAccordion unit tests: 31 passed across 2 files.

The full coverage suite was not run. Large bundle warnings remain in the upstream
workshop build; they do not block the source-first development server.