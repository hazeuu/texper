#!/usr/bin/env bash

echo "=== CHECK PROXY FILE ==="
ls -l ./cloud-sql-proxy.linux.amd64
file ./cloud-sql-proxy.linux.amd64
echo "=== END CHECK ==="

echo "$GCP_SERVICE_ACCOUNT_JSON" > /tmp/key.json
chmod +x ./cloud-sql-proxy.linux.amd64

# 👉 cloud-sql-proxy v2 — KHÔNG dùng --instances
./cloud-sql-proxy.linux.amd64 \
  $PROJECT_ID:$REGION:$INSTANCE_NAME \
  --credentials-file=/tmp/key.json \
  --port=3306 \
  --quiet &

echo "Proxy started in background..."
sleep 5

echo "Starting Node app..."
node server.js
