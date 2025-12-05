#!/bin/bash

docker-compose up -d --build

cd ..

git clone https://github.com/stefanprodan/dockprom
cd dockprom
ADMIN_USER='admin' ADMIN_PASSWORD='admin' ADMIN_PASSWORD_HASH='$2a$14$1l.IozJx7xQRVmlkEQ32OeEEfP5mRxTpbDTCTcXRqn19gXD8YK1pO' docker-compose up -d --build
open -a Safari http://localhost:5050
open -a Safari http://localhost:80/dashboard/
open -a Safari http://localhost:3000/dashboards
