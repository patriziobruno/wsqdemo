#!/bin/sh
npm install /usr/src/demo/broker
npm install /usr/src/demo/collector
npm install /usr/src/demo/dispatcher
cp /usr/src/demo/demorunall.sh /usr/bin
chmod +x /usr/bin/demorunall.sh
