'use strict';

var mockery = require('mockery');
var EventEmitter = require('events');
var jwt = require('jsonwebtoken');

/**
 * A mockup class for WebSocket.Server(npmjs.com/package/ws).
 * The constructor simulates a successfull connection accept and a message event.
 */
class wsServer extends EventEmitter {
    constructor() {
        super();
        var that = this;

        // this is required by AuthenticatedWebSocketServer.broadcast
        that.clients = [];
        that.clients.push(new ws());

        // a timeout will give the test script some time to register event handlers and simulates IO
        setTimeout(() => {
            var socket = new ws();
            that.emit('connection', socket);
            setTimeout(()=> {
                socket.emit('message', 'test');
            }, 200);
        }, 100);
    }
}

/**
 * A mockup class for WebSocket (npmjs.com/package/ws). The constructor simulates a successfull connection open.
 */
class ws extends EventEmitter {
    constructor() {
        super();
        // a timeout will give the test script some time to register event handlers and simulates IO
        setTimeout(()=> {
            this.emit('open', {});
        }, 500);
    }

    /**
     * Calls testData.done with message as parameter
     * @param message {String} message
     * @param callback {ws~sendCallback} called to report errors
     */
    send(message, callback) {
            if (testData && typeof testData.done == 'function') {
                setTimeout(()=> {
                    try {
                        testData.done(message);
                    } catch(e) {
                        callback.call(this, e);
                    }
                }, 1);
            }
    }

    static get Server() {
        return wsServer;
    }
}

/**
 * This callback handles in-band errors, occurring before a message get sent.
 * @callback ws~sendCallback
 * @param {Error} error
 */

/**
 * A mockup class for npmjs.com/package/node-rest-client.
 */
class node_rest_client {
    /**
     * Used by AuthenticatedWebSocketClient for the authentication
     * phase. If the body contains a valid username/password pair (test/test), it calls the callback gets called
     * with a JWT token as first parameter and a status 200 (OK) as second parameter
     * @param url {String} ignored
     * @param body {Object} contains user credentials: username and password
     * @param callback {node_rest_client~postCallback} called to report completion of the call
     */
    post(url, body, callback) {

        // a timeout will give the test script some time to register event handlers and simulates IO
        setTimeout(()=> {
            if (body.username == 'test' && body.username == 'test') {
                callback(jwt.sign({username: body.username}, 'pbruno4demo'), {
                    statusCode: 200
                    , statusMessage: 'OK'
                });
            } else {
                callback(null, {statusCode: 401, statusMessage: 'unauthorized'});
            }
        }, 100);

        return new EventEmitter();
    }
}

/**
 * This callback gets called with a result and a HTTP response as parameters when a REST POST request completes.
 * @callback node_rest_client~postCallback
 * @param {String} body of the response
 * @param {http.IncomingMessage} response info
 */

/**
 * A mockup object for NodeJS' http and https modules.
 */
var http = {
    /**
     * Mocks http.createServer, returning an object containing the only listen function
     * @returns {{listen: listen}}
     */
    createServer: function () {
        return {
            /**
             * Fakes httpServer.listen
             * @param port {Number} ignored
             * @param cb {http~serverListenCallback} called after a few milliseconds
             */
            listen: function (port, cb) {
                // a timeout will give the test script some time to register event handlers and simulates IO
                setTimeout(cb, 10);
            }
        };
    }

    /**
     * needed by express (npmjs.com/package/express)
     */
    , IncomingMessage: function () {
    }
    /**
     * needed by express (npmjs.com/package/express)
     */
    , ServerResponse: function () {
    }
};

/**
 * This callback gets called after a few milliseconds with no parameters when a httpServer.listen is called.
 * @callback http~serverListenCallback
 */

// enable mockups
mockery.enable({
    warnOnReplace: false
    , warnOnUnregistered: false
    , useCleanCache: true
});

mockery.registerMock('ws', ws);
mockery.registerMock('node-rest-client', {Client: node_rest_client});
mockery.registerMock('http', http);
mockery.registerMock('https', http);

// tests may need to register event handlers on ws
module.exports.ws = ws;

// testData: data and functions called by the mockups
var testData;
/**
 * (Re)Initialize test data.
 */
function initTestData() {
    module.exports.testData = testData = {
        done: function () {
        }
    };
}


initTestData();

// test may need to reset test data to initial values
module.exports.resetTestData = initTestData;
