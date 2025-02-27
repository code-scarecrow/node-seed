#!/bin/sh
echo "Running NPM Install"
if [ ! -d node_modules ]; then
    npm install
fi

npm run build
npm run migration:run