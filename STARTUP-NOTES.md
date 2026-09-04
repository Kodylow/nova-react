# Startup audit

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