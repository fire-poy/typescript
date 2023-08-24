#!/bin/sh

ln -s \
  /app/node_modules/@nestjs/cli/bin/nest.js \
  /usr/local/bin/nest

npm install

npm run start:dev
