# Running this fork quickly

Read `CLAUDE.md` for code conventions and `CONTRIBUTING.md` before making changes.
This file documents the fork-specific startup path.

## Fresh import

1. Run `bash run.sh` from the root. It installs pinned dependencies and starts Vite.
2. Expose port **3000** and open **/react/**, not just the root.
3. On subsequent boots, use `pnpm start` if dependencies are already installed.

Use `bash run.sh --port 3100` for isolated testing. Ports are strict; do not accept a
smoke test that accidentally requests an older server already running on 3000.

Replit/Docker should provide Node 22. On a bare Linux VM the bootstrap caches a
checksum-verified Node runtime in the user's home. It needs curl, wget, or Python 3.
If none exists on Ubuntu: `sudo apt-get update && sudo apt-get install -y curl`.
The bootstrap uses npm's cached pnpm 10.8.0, so enabling global Corepack shims
or installing global pnpm is unnecessary.

## Do not put release work on the startup path

- Do not run `pnpm build:lib`, `pnpm prebuild`, or tests to launch the workshop.
- Do not install `@visa/scripts`, downgrade to another release, or regenerate a lockfile.
- Do not request credentials; no secrets or external services are required.
- Vite/TypeScript resolve `@visa/nova-react` to `libs/nova-react/src`.
- API metadata and source views use the checked-in library source.
- `predev` generates the small ignored example manifest; it is required on a fresh clone.
- Keep host validation enabled. Replit preview suffixes are allowed; other proxies
  use `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=<exact hostname>`.
- The full library/release workflow remains separate (`pnpm dev:packages`,
  `pnpm build:lib`, `pnpm build`). It is not a setup prerequisite.

## Checks for startup changes

Test from a new checkout with no `node_modules`, `dist` output, or generated
manifest. Run on an unused port. Verify the rendered home page, a component
example, its API table, and a hook/source view in a browser; HTML 200 alone does
not prove the JavaScript application works. Confirm arbitrary hosts are rejected.
Run `pnpm build:docs` to check the production bundle and TypeScript.
For existing runtime tests, use the repository's Vitest commands in `CLAUDE.md`.

For persistent VM use, start the command under systemd (or another available
supervisor), with the repository as WorkingDirectory, and expose that service's
port. Do not create another environment image or a public upstream pull request
just to run this fork.