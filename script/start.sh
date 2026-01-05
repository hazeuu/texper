echo "=== CHECK PROXY FILE ==="
ls -l ../../cloud_sql_proxy.linux.amd64
file ../../cloud_sql_proxy.linux.amd64
echo "=== END CHECK ==="

echo "$GCP_SERVICE_ACCOUNT_JSON" > /tmp/key.json

chmod +x ../../cloud_sql_proxy.linux.amd64

../../cloud_sql_proxy.linux.amd64 -instances=$PROJECT_ID:$REGION:$INSTANCE_NAME=tcp:3306 -credential_file=/tmp/key.json &
echo "Proxy started in background..."

sleep 5

echo "Starting Node app..."
node server.js
