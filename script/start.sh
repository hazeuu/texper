#!/usr/bin/env bash
set -e

echo "=== CHECK PROXY FILE ==="
ls -l ./cloud-sql-proxy.linux.amd64
file ./cloud-sql-proxy.linux.amd64
echo "=== END CHECK ==="

# Tạo file key tạm
echo "$GCP_SERVICE_ACCOUNT_JSON" > /tmp/key.json

# Cho phép chạy proxy
chmod +x ./cloud-sql-proxy.linux.amd64

# Chạy proxy (bật verbose để xem log)
./cloud-sql-proxy.linux.amd64 \
  -instances=$PROJECT_ID:$REGION:$INSTANCE_NAME=tcp:3306 \
  -credential_file=/tmp/key.json \
  -verbose &

echo "Proxy started in background..."
sleep 5

echo "=== CHECK PORT 3306 ==="
netstat -tulpn | grep 3306 || echo "PORT NOT LISTENING"
echo "======================="

echo "Starting Node app..."
node server.js
