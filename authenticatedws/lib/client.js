'use strict';

var EventEmitter = require('events');
var WebSocket = require('ws');

/**
 * This is a WebSocket client wrapper featuring authentication. Authentication is performed through a REST call to the /login
 * endpoint exposed by the same server hosting the WS.
 */
class AuthenticatedWebSocketClient extends EventEmitter {

    /**
     * Initialize a new instance of AuthenticatedWebSocketClient.
     * @param options {{username:string, password:string, host:string, port:number, secure:boolean}}
     */
    constructor(options) {
        super();
        this.options = options || {};
    }

    /**
     * starts the connection
     */
    connect() {
        var options = this.options
            , client = require('node-rest-client').Client
            , restClient = new client()
            , username = options.username || 'test'
            , password = options.password || 'test'
            , host = options.host || 'localhost'
            , port = options.port || 8081
            , secure = options.secure || false
            , purl = `${secure ? 's' : ''}://${host}:${port}`
            , that = this;

        restClient.post(`http${purl}/login`, {
            username: username
            , password: password
        }, (token, response) => {

            if (response.statusCode == 200 && token) {

                that.ws = new WebSocket(`ws${purl}`, {
                    headers: {
                        token: token.toString()
                    }
                });

                that.ws.on('open', () => {
                    that.emit('open', token);
                    that.ws.on('message', (message) => {
                        that.emit('message', JSON.parse(message));
                    });
                });

                that.ws.on('close', () => {
                    that.emit('close');
                });

                that.ws.on('error', (error) => {
                    that.emit('error', error);
                });
            } else {
                let LoginError = require('./loginerror');
                that.emit('login_error', new LoginError(response.statusCode, response.statusMessage));
            }
        }).on('requestTimeout', (req) => {
            req.abort();
            that.emit('error', new Error('request timeout'));
        }).on('responseTimeout', () => {
            that.emit('error', new Error('response timeout'));
        }).on('error', (err) => {
            that.emit('error', err);
        });
    }

    /**
     * Send a message through the web-socket
     * @param data
     */
    send(data) {
        this.ws.send(JSON.stringify(data));
    }
}

module.exports = AuthenticatedWebSocketClient;

