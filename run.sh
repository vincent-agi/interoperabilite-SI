#!/bin/bash

docker-compose up -d --build

cd ..

git clone https://github.com/stefanprodan/dockprom
cd dockprom
ADMIN_USER='admin' ADMIN_PASSWORD='admin' ADMIN_PASSWORD_HASH='$2a$14$1l.IozJx7xQRVmlkEQ32OeEEfP5mRxTpbDTCTcXRqn19gXD8YK1pO' docker-compose up -d --build
