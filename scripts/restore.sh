#!/usr/bin/env bash
# Restore a backup into the running deployment's data volume.
#   ./scripts/restore.sh backups/<timestamp>
# Stops the service, removes stale SQLite WAL files, copies the backup in, and starts again.
set -euo pipefail
SRC="${1:?usage: scripts/restore.sh backups/<timestamp>}"
[ -f "$SRC/miraah.db" ] || { echo "No miraah.db in $SRC"; exit 1; }
# Take the volume from THIS project's container, never by name across the host
# (another deployment on the same machine could have a matching volume name).
CID="$(docker compose ps -aq miraah)"
[ -n "$CID" ] || { echo "No miraah container in this project. Run 'docker compose up -d' once first."; exit 1; }
VOL="$(docker inspect "$CID" --format '{{range .Mounts}}{{if eq .Destination "/app/data"}}{{.Name}}{{end}}{{end}}')"
[ -n "$VOL" ] || { echo "Data volume not found on container $CID"; exit 1; }
docker compose stop miraah
docker run --rm -v "$VOL":/d -v "$(cd "$SRC" && pwd)":/b:ro alpine sh -c \
  'rm -f /d/miraah.db /d/miraah.db-wal /d/miraah.db-shm && rm -rf /d/evidence && cp -a /b/miraah.db /d/ && { [ -d /b/evidence ] && cp -a /b/evidence /d/ || true; } && chown -R 1000:1000 /d'
docker compose start miraah
echo "Restored $SRC into volume $VOL"
