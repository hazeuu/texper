
echo "$GCP_SERVICE_ACCOUNT_JSON" > /tmp/key.json

./cloud_sql_proxy -instances=$PROJECT_ID:$REGION:$INSTANCE_NAME=tcp:3306 -credential_file=/tmp/key.json &

sleep 2

node server.js
