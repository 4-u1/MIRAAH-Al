#!/bin/sh
# Runs as root only to fix ownership of the mounted data and backup folders (bind mounts and
# restored files may be root-owned), then drops to the unprivileged "node" user.
set -e
for d in /app/data /app/backups; do
  mkdir -p "$d"
  chown -R node:node "$d" 2>/dev/null || true
done
exec setpriv --reuid=node --regid=node --init-groups "$@"
