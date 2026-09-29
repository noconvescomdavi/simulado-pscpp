#!/bin/sh
set -e
echo "Applying schema.sql..."
psql -h postgres -U estibordo -d estibordo -v ON_ERROR_STOP=1 -f /db/schema.sql
for f in /db/migrations/*.sql; do
  echo "Applying migration: $f"
  psql -h postgres -U estibordo -d estibordo -v ON_ERROR_STOP=1 -f "$f" || { echo "FAILED: $f"; exit 1; }
done
echo "All migrations applied successfully."
