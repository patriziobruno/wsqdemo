'use strict';

var mqtt = require('mqtt');
var authenticatedws = require('authenticatedws');
var EventEmitter = require('events');

class collector extends  EventEmitter {
    constructor(options) {
        super();
        options = options || {aws: {port: 8080}, mqtt: {topic: 'default'}};

        var aws = new authenticatedws.Server(options.aws)
            , client = mqtt.connect(options.mqtt)
            , that = this;

        client.on('connect', function () {
            client.subscribe(options.mqtt.topic);

            aws.on('message', function (msg) {
                that.emit('message', msg);
                client.publish(options.mqtt.topic, msg);
            }).on('error', (err)=> {
                that.emit('error', err);
            });
        }).on('error', (err)=> {
            that.emit('error', err);
        });
    }
}
module.exports  =collector;