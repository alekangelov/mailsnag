#!/bin/bash

# Start the first process
./main &

# Start the second process
HOSTNAME=$(SERVER_HOST || "0.0.0.0") PORT=$(SERVER_PORT || "80") node ./server.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?