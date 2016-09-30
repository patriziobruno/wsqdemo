#!/usr/bin/env sh

node_modules/.bin/mocha -t 10000 && cd authenticatedws && npm test || exit 1
