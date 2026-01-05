echo "=== CHECK PROXY FILE ==="
ls -l ../../cloud_sql_proxy
file ../../cloud_sql_proxy
echo "=== END CHECK ==="

echo "$GCP_SERVICE_ACCOUNT_JSON" > /tmp/key.json
../../cloud_sql_proxy -instances=$PROJECT_ID:$REGION:$INSTANCE_NAME=tcp:3306 -credential_file=/tmp/key.json &
echo "Proxy started in background..."
sleep 5
echo "Starting Node app..."
node server.js
