#!/usr/bin/env bash
# Copyright 2026 Visa. Licensed under the Apache License, Version 2.0.
# See LICENSE or https://www.apache.org/licenses/LICENSE-2.0.
set -euo pipefail
cd "$(dirname "$0")"

mode=preview
if [ "${1:-}" = "--dev" ]; then mode=dev; shift; fi
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  echo "Usage: bash run.sh [--dev] [--host ADDRESS] [--port PORT]"
  echo "Default: serve the checked-in snapshot without npm install."
  echo "--dev: install locked dependencies and start live-reloading Vite."
  exit 0
fi
if [ "$mode" = preview ]; then
  if [ ! -f preview/workshop.tar.gz ] || [ ! -f preview/manifest.json ]; then
    echo "Preview snapshot is missing. Use bash run.sh --dev, or pnpm preview:build." >&2
    exit 1
  fi
  # A preview needs no npm, pnpm, node_modules, or Node 22.
  if command -v node >/dev/null 2>&1 && node -e 'process.exit(+process.versions.node.split(".")[0] >= 18 ? 0 : 1)'; then
    exec node bin/serve-preview.mjs "$@"
  elif command -v python3 >/dev/null 2>&1; then
    exec python3 bin/serve-preview.py "$@"
  fi
fi

# Replit/Docker provide Node. Bare Linux VMs get a user-local, checksum-verified
# runtime, without changing system packages or needing root.
NODE_VERSION=22.23.2
node_is_supported() {
  command -v node >/dev/null 2>&1 &&
    node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major >= 22 && (major !== 22 || minor >= 12) ? 0 : 1)'
}
if ! node_is_supported; then
  case "$(uname -s)/$(uname -m)" in
    Linux/x86_64) platform=linux-x64 ;;
    Linux/aarch64) platform=linux-arm64 ;;
    *) echo "Install Node 22.12+ (https://nodejs.org), then rerun bash run.sh." >&2; exit 1 ;;
  esac
  runtime="${XDG_CACHE_HOME:-$HOME/.cache}/nova-react/node-v${NODE_VERSION}-${platform}"
  if [ ! -x "$runtime/bin/node" ]; then
    download() {
      if command -v curl >/dev/null 2>&1; then curl -fLsS "$1" -o "$2"
      elif command -v wget >/dev/null 2>&1; then wget -q "$1" -O "$2"
      elif command -v python3 >/dev/null 2>&1; then
        python3 -c 'import sys, urllib.request; urllib.request.urlretrieve(sys.argv[1], sys.argv[2])' "$1" "$2"
      else
        echo "Install curl, wget, or Python 3, then rerun bash run.sh." >&2; return 1
      fi
    }
    archive="node-v${NODE_VERSION}-${platform}.tar.gz"
    mkdir -p "$(dirname "$runtime")"
    tmp=$(mktemp -d "$(dirname "$runtime")/download.XXXXXX")
    trap 'rm -rf "$tmp"' EXIT
    echo "Installing Node $NODE_VERSION in the user cache..."
    download "https://nodejs.org/dist/v${NODE_VERSION}/${archive}" "$tmp/$archive"
    download "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" "$tmp/SHASUMS256.txt"
    (cd "$tmp"; grep "  ${archive}$" SHASUMS256.txt | sha256sum --check --strict)
    tar -xzf "$tmp/$archive" -C "$tmp"
    mv "$tmp/node-v${NODE_VERSION}-${platform}" "$runtime"
    rm -rf "$tmp"
    trap - EXIT
  fi
  export PATH="$runtime/bin:$PATH"
fi

if [ "$mode" = preview ]; then exec node bin/serve-preview.mjs "$@"; fi

# npm exec works even when Corepack shims aren't enabled or /usr/bin is read-only.
# The pinned pnpm executable is cached by npm on subsequent starts.
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
npm exec --yes --package=pnpm@10.8.0 -- pnpm install --frozen-lockfile
exec npm exec --yes --package=pnpm@10.8.0 -- pnpm dev "$@"