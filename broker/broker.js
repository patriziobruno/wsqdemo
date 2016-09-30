#!/usr/bin/env node

'use strict';

/**
 * Wrapper to run mosca
 */

var mosca = require('mosca');
var l4js = require('log4js');
var logger = l4js.getLogger('broker');

var listener = {
    type: 'mongo'
    , url: 'mongodb://localhost:27017/mqtt'
    , pubsubCollection: 'listeners'
    , mongo: {}
};

var settings = {
    port: 1883,
    backend: listener
};

var server = new mosca.Server(settings);

server.on('clientConnected', (client) => {
    logger.log(l4js.INFO, 'client connected ' + client.id);
});

// fired when a message is received
server.on('published', (packet, client) => {
    logger.log(l4js.INFO, 'Published ' + packet.payload);
});

server.on('error', (err)=> {
    logger.log(l4js.ERROR, err);
});

server.on('ready', setup);

function setup() {
    logger.log(l4js.INFO, 'Mosca server is up and running');
}
