# Startup audit

## Current source-first startup optimization

The instant-preview approach was rejected: a snapshot is not a development
environment. This correction removes those artifacts and restores
source-based Vite startup and the development Docker image.

The optimization is deliberately on orchestration and redundant work:

- Resolve pnpm 10.8.0 once, not through two separate npm exec calls.
- After the full frozen-lockfile install, invoke the workshop's normal predev/dev
  lifecycle directly instead of chaining root start, dev:docs, and workspace scripts.
- Read/write each example metadata file once rather than once per example.
- Leave unchanged generated files untouched to avoid spurious watcher events.
- Preserve source compilation, HMR, all dependencies, and existing validation commands.

### Paired cold-install measurements

Both versions were extracted into new directories with empty HOME, npm and pnpm
caches, no node_modules or generated build output, and Node hidden from PATH.
Each trial downloaded a checksum-verified Node runtime and all 992 packages
(zero reused). Chromium used a fresh browser context. The browser process and VM
were already running; cloning and VM provisioning are excluded.

| Source-based launcher | HTTP ready, trials 1 / 2 | Rendered home, trials 1 / 2 |
| --- | --- | --- |
| Original | 22.48 / 19.51 s | 28.67 / 25.18 s |
| Corrected | 16.26 / 15.54 s | 21.75 / 20.44 s |

That is about 24% less time to HTTP readiness and 22% less time to rendered
content using the two-trial averages—not a guarantee across machines or networks.
The candidate also passed live source-edit HMR without a page reload, button
example/source/API checks, hook source views, and rejection of an arbitrary Host.
There were no browser page errors.

`pnpm test:startup` tests frozen install, single pnpm resolution, correct argument
forwarding, stopping on install failure, preserved custom metadata, discovery of
new examples, and no writes for unchanged metadata.

## Original source-first audit

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