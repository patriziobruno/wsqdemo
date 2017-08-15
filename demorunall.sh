#!/usr/bin/env bash

mkdir -p /var/log/mongodb
mongod --fork --logpath /var/log/mongodb/server.log

nohup /usr/bin/broker > /var/log/broker.log 2>&1 &
BPID=$!
echo $BPID > /var/run/broker.pid

sleep 2

nohup /usr/bin/collector > /var/log/collector.log 2>&1 &
CPID=$!
echo $CPID > /var/run/collector.pid

sleep 2

nohup /usr/bin/dispatcher > /var/log/dispatcher.log 2>&1
DPID=$!
echo $DPID > /var/run/dispatcher.pid
