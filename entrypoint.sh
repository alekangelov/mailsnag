#!/bin/bash
export INTERNAL_DOCKER_IP
export NEXT_PUBLIC_DATA_URL
INTERNAL_DOCKER_IP=$(ip route | awk 'NR==1 {print $3}')
NEXT_PUBLIC_DATA_URL="http://${INTERNAL_DOCKER_IP}:${SERVER_PORT}"



echo "INTERNAL_DOCKER_IP: $INTERNAL_DOCKER_IP"
echo "NEXT_PUBLIC_DATA_URL: $NEXT_PUBLIC_DATA_URL"


# Start the first process
./main &

# Start the second process
PORT=${WEB_SERVER_PORT:-"3000"} NEXT_PUBLIC_DATA_URL="http://${INTERNAL_DOCKER_IP}:${SERVER_PORT}" node ./server.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?