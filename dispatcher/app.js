#!/usr/bin/env node

'use strict';
var config = require('config');
var l4js = require('log4js');
var logger = l4js.getLogger('broker');

function getConfig() {
    return {
        aws: {
            secret: config.has('aws.jwtsecret') ? config.get('aws.jwtsecret') : 'pbruno4demo'
            , port: config.has('aws.port') ? config.get('aws.port') : 8081
        }
        , mqtt: {
            url: config.has('mqtt.url') ? config.get('mqtt.url') : 'mqtt://localhost'
            , topic: config.has('mqtt.topic') ? config.get('mqtt.topic') : 'demoqueue'
        }
    };
}

var dispatcher = new (require('./index'))(getConfig());

dispatcher.on('connect', ()=> {
    logger.log('INFO', 'MQTT connected');
});

dispatcher.on('message', (message)=> {
    logger.log('INFO', 'MQTT message to be broadcasted ' + message.toString());
});

dispatcher.on('error', (err)=> {
    logger.log('ERROR', err);
});
