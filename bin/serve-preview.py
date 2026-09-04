#!/usr/bin/env python3
"""Copyright 2026 Visa.
Licensed under the Apache License, Version 2.0.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
import argparse
import gzip
import hashlib
import io
import ipaddress
import json
import mimetypes
import os
from pathlib import Path, PurePosixPath
import re
import socket
import tarfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit

parser = argparse.ArgumentParser(description="Zero-install snapshot preview; use --dev for live source edits.")
parser.add_argument("--host", default="0.0.0.0")
parser.add_argument("--port", type=int, default=os.environ.get("PORT", "3000"))
args = parser.parse_args()
if not 1 <= args.port <= 65535:
    parser.error("Port must be 1–65535.")
root = Path(__file__).resolve().parent.parent / "preview"
archive = (root / "workshop.tar.gz").read_bytes()
manifest = json.loads((root / "manifest.json").read_text())
if hashlib.sha256(archive).hexdigest() != manifest["archiveSha256"]:
    raise SystemExit("Preview checksum mismatch. Restore the snapshot or run pnpm preview:build.")
files = {}
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as tar:
    for entry in tar:
        if (not entry.isfile() or entry.name.startswith("/") or "\\" in entry.name
                or any(part in ("", ".", "..") for part in entry.name.split("/")) or entry.name in files):
            raise SystemExit("Invalid preview archive entry: " + entry.name)
        files[entry.name] = tar.extractfile(entry).read()
if "index.html" not in files:
    raise SystemExit("Preview archive has no index.html.")
compressed = {}
types = {".js": "text/javascript", ".css": "text/css", ".woff": "font/woff",
         ".woff2": "font/woff2", ".svg": "image/svg+xml", ".md": "text/plain"}


def allowed_host(value):
    if not value or re.search(r"[\\/@?#\s]", value):
        return False
    try:
        hostname = urlsplit("http://" + value).hostname or ""
        if (hostname == "localhost" or hostname.endswith((".localhost", ".replit.dev", ".repl.co"))
                or hostname == os.environ.get("__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS", "").lower()):
            return True
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


class Handler(BaseHTTPRequestHandler):
    def reply(self, status, body=b"", headers=None):
        self.send_response(status)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        values = {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache"}
        values.update(headers or {})
        for key, value in values.items():
            self.send_header(key, value)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_GET(self):
        if not allowed_host(self.headers.get("Host")):
            return self.reply(403, b"Host is not allowed.")
        try:
            raw = self.path.split("?")[0]
            if re.search(r"%(?![0-9a-fA-F]{2})", raw):
                raise ValueError()
            path = unquote(raw, errors="strict")
        except (UnicodeError, ValueError):
            return self.reply(400, b"Malformed URL.")
        if "\\" in path or re.search(r"[\x00-\x1f]", path) or ".." in path.split("/"):
            return self.reply(400, b"Invalid path.")
        if path in ("/", "/react"):
            return self.reply(302, headers={"Location": "/react/"})
        if not path.startswith("/react/"):
            return self.reply(404, b"Not found.")
        name = path[len("/react/"):] or "index.html"
        if name not in files:
            if name.startswith("assets/") or PurePosixPath(name).suffix:
                return self.reply(404, b"Not found.")
            name = "index.html"
        content_type = types.get(PurePosixPath(name).suffix) or mimetypes.guess_type(name)[0] or "application/octet-stream"
        body = files[name]
        headers = {"Content-Type": content_type, "Vary": "Accept-Encoding"}
        if re.fullmatch(r"assets/.+-[\w-]{8,}\.[\w]+", name):
            headers["Cache-Control"] = "public, max-age=31536000, immutable"
        accepted = any(re.fullmatch(r"gzip(?:\s*;.*)?", token.strip(), re.I)
                       and not re.search(r";\s*q=0(?:\.0*)?\s*$", token.strip(), re.I)
                       for token in self.headers.get("Accept-Encoding", "").split(","))
        if accepted and len(body) > 512 and content_type.startswith(("text/", "application/json", "image/svg")):
            if name not in compressed:
                compressed[name] = gzip.compress(body, mtime=0)
            body = compressed[name]
            headers["Content-Encoding"] = "gzip"
        return self.reply(200, body, headers)

    do_HEAD = do_GET

    def reject_method(self):
        self.reply(405, b"Method not allowed.", {"Allow": "GET, HEAD"})

    do_POST = do_PUT = do_DELETE = do_PATCH = do_OPTIONS = reject_method

    def log_message(self, *_):
        pass


class Server(ThreadingHTTPServer):
    # Never reuse another live server's port.
    allow_reuse_address = True
    daemon_threads = True


if ":" in args.host:
    Server.address_family = socket.AF_INET6
try:
    server = Server((args.host, args.port), Handler)
except OSError as error:
    raise SystemExit("Preview failed: " + str(error))
print(f"Snapshot preview ready: http://localhost:{args.port}/react/", flush=True)
print("No dependencies installed. For source edits and live reload: bash run.sh --dev", flush=True)
server.serve_forever()