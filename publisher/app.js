#!/usr/bin/env node

'use strict';

var config = require('config');

function getConfig() {
    return {
        aws: {
            host: config.has('aws.host') ? config.get('aws.host') : 'localhost'
            , port: config.has('aws.port') ? config.get('aws.port') : 8080
            , secret: config.has('aws.secret') ? config.get('aws.secret') : false
            , username: config.has('aws.username') ? config.get('aws.username') : 'test'
            , password: config.has('aws.password') ? config.get('aws.password') : 'test'
        }
    };
}

require('./index')(getConfig());