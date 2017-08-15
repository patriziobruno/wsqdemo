'use strict';

var mqtt = require('mqtt');
var authenticatedws = require('authenticatedws');
var EventEmitter = require('events');

class dispatcher extends EventEmitter {
  constructor(options) {
    super();
    options = options || {aws: {port: 8082}, mqtt: {topic: 'default'}};

    var client = mqtt.connect(options.mqtt.url)
      , aws = new authenticatedws.Server(options.aws)
      , that = this;

    client.on('connect', function () {
      that.emit('connect');
      client.subscribe(options.mqtt.topic);
    });

    // every message received through the queue will be delivered to the connected web socket clients
    client.on('message', (topic, message) => {
      that.emit('message', message);
      if (topic == options.mqtt.topic)
        aws.broadcast(message);
    });

    client.on('error', (err)=> {
      that.emit('error', err);
    });

    aws.on('error', (err)=> {
      that.emit('error', err);
    });
  }
}

module.exports = dispatcher;
