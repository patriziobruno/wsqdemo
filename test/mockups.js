'use strict';

var mockery = require('mockery');
var EventEmitter = require('events');

var queues = {};

class mqttClient extends EventEmitter {

    constructor() {
        super();
        setTimeout(()=> {
            this.emit('connect');
        }, 100);
    }

    subscribe(queue) {
        if (!queues[queue]) {
            queues[queue] = [this];
        } else {
            queues[queue].push(this);
        }
    }

    publish(queue, message) {
        if (queues[queue])
            queues[queue].forEach((subscriber) => {
                setTimeout(()=> {
                    subscriber.emit('message', queue, message);
                }, 200);
            });
    }
}

// enable mockups
mockery.enable({
    warnOnReplace: false
    , warnOnUnregistered: false
    , useCleanCache: true
});

var mqtt = {
    connect: function () {
        return new mqttClient();
    }
};

mockery.registerMock('mqtt', mqtt);

module.exports.mqtt = mqtt;
