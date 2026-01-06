#!/usr/bin/env bash
set -e

echo ">>> Detect script directory"
SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
ROOT_DIR="$SCRIPT_DIR/.."

echo "SCRIPT_DIR: $SCRIPT_DIR"
echo "ROOT_DIR: $ROOT_DIR"

cd "$ROOT_DIR"

echo "PWD now:"
pwd

echo "=== LIST ROOT ==="
ls -R .

echo "=== FIND PROXY ==="
PROXY=$(find . -maxdepth 2 -name "cloud_sql_proxy.linux.amd64" | head -1)

if [ -z "$PROXY" ]; then
  echo ">>> KHÔNG TÌM THẤY cloud_sql_proxy.linux.amd64"
  exit 1
fi

echo "Proxy found at: $PROXY"
chmod +x "$PROXY"

echo "$GCP_SERVICE_ACCOUNT_JSON" > /tmp/key.json

"$PROXY" -instances=$PROJECT_ID:$REGION:$INSTANCE_NAME=tcp:3306 \
  -credential_file=/tmp/key.json &

echo "Proxy started..."
sleep 5

echo "Starting Node app..."
node backend/backend/server.js
