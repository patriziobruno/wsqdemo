'use strict';

var authenticatedws = require('authenticatedws');
var EventEmitter = require('events');

class subscriber extends EventEmitter {

    constructor(options) {
        super();
        var that = this;

        options = options || {aws: {port: 8081}};

        var aws = new authenticatedws.Client(options.aws);
        aws.connect();
        aws.on('open', () => {
            that.emit('open');
            aws.on('message', (data) => {
                that.emit('message', data);
            });
        });

        aws.on('error', (exception) => {
            that.emit('error', exception);
        });
    }
}

module.exports = subscriber;