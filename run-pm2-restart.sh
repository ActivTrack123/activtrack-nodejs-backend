#!/bin/bash

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "PM2 is not installed. Please install PM2 globally."
    exit 1
fi

# Change to the directory where your Node.js application is located
cd /var/www/toucan-backend-nodejs-v2

# Replace 'myapp' with the actual name of your PM2 process
pm2 restart toucan-server

# You can use 'pm2 list' to view the list of running PM2 processes
#pm2 list
