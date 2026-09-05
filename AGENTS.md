# Agent entry point: launch first, investigate second

## Task: "get this repo running"

**Your next action should be starting the app, not exploring the repository.**
This section is sufficient for a startup-only task. Do not read package files,
architecture docs, `CLAUDE.md`, or `CONTRIBUTING.md` before the first launch attempt.
Read those before making code changes, after starting the app when possible.
A quick check for an existing instance is fine; do not start a duplicate server.

From the repository root:

```sh
bash run.sh
```

- **Port:** `3000`. **Open:** `/react/`. **Local URL:** `http://localhost:3000/react/`.
- **What it does:** provisions Node if necessary, installs the frozen dependencies,
  generates navigation via `predev`, and starts real Vite source compilation + HMR.
- **No credentials, external service, library build, or extra setup command needed.**
- Use the platform's persistent runner. On a bare VM, use systemd or another
  supervisor with this repository as WorkingDirectory. Do not wait for a
  foreground dev server to exit; configure the endpoint while it starts.
- Watch the process and logs immediately. If it exits or reports a fatal setup
  error, inspect that error now. Never silently poll HTTP for minutes while a
  crashed service restarts. A successful process spawn is not readiness.
- Open the home page in a browser as soon as HTTP responds. Share the URL and
  what you verified promptly; do not hold the running app behind a repository audit.

**Once the app is running**, inspect architecture, investigate improvements, run
broader checks, or make requested changes. If startup fails, investigate only
the reported failure first—not the whole repository.

## Known startup details — no need to rediscover these

For a fresh download, use `git clone --depth 1` unless history is needed for the task.
On subsequent boots, use `pnpm start` if dependencies are already installed.

Use `bash run.sh --port 3100` for isolated testing. Ports are strict; do not accept a
smoke test that accidentally requests an older server already running on 3000.

Replit/Docker should provide Node 22. On a bare Linux VM the bootstrap caches a
checksum-verified Node runtime in the user's home. It needs curl, wget, or Python 3.
If none exists on Ubuntu: `sudo apt-get update && sudo apt-get install -y curl`.
Systemd does not inherit your shell's PATH: provide HOME and explicit tool paths,
or check/install the downloader in the **service's** environment before launching.
The bootstrap uses npm's cached pnpm 10.8.0, so enabling global Corepack shims
or installing global pnpm is unnecessary.
It resolves pnpm once for both installation and the workshop's standard predev/dev
lifecycle. Never skip the frozen install, serve a snapshot, or bypass source
compilation to improve the startup metric. `bash run.sh --dev` is a source-dev alias.

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

Read `CLAUDE.md` and `CONTRIBUTING.md` before editing. Preserve normal development,
build, lint, and test practices; do not optimize by replacing the app with a snapshot.
Run validation after launching so the user can use the app while checks execute.

Test from a new checkout with no `node_modules`, `dist` output, or generated
manifest. Run on an unused port. Verify the rendered home page, a component
example, its API table, and a hook/source view in a browser; HTML 200 alone does
not prove the JavaScript application works. Confirm arbitrary hosts are rejected.
Run `pnpm build:docs` to check the production bundle and TypeScript.
Run `pnpm test:startup` for launcher argument forwarding, install failure handling,
and metadata-generation invariants. Verify a source edit updates the browser via HMR.
For existing runtime tests, use the repository's Vitest commands in `CLAUDE.md`.

For persistent VM use, start the command under systemd (or another available
supervisor), with the repository as WorkingDirectory, and expose that service's
port. Do not create another environment image or a public upstream pull request
just to run this fork.