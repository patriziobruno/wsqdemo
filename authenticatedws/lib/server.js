'use strict';

var EventEmitter = require('events');
var WebSocket = require('ws');

class AuthenticatedWebSocketServer extends EventEmitter {

    constructor(options) {
        super();
        options = options || {};

        var express = require('express')
            , jwt = require('jsonwebtoken')
            , bodyParser = require('body-parser')
            , secret = options.secret || "pbruno4demo"
            , port = options.port || 8081
            , secure = options.secure || false
            , that = this
            , http = require(secure ? 'https' : 'http')
            , app = express();

        app.use(bodyParser.json());

        app.post('/login', (req, res) => {
            var token = authenticate(req.body.username, req.body.password);
            res.status(token ? 200 : 401).send(token);
        });

        var httpServer = http.createServer(app);

        that.wss = new WebSocket.Server({
            server: httpServer
            , verifyClient: verifyClient
        });

        that.wss.broadcast = function broadcast(data) {
            this.clients.forEach((client) => {
                client.send(data);
            });
        };

        function verifyClient(info, cb) {
            var token = info.req.headers.token;

            if (!token) {
                cb(false);
            } else {
                jwt.verify(token, secret, (err, decoded) => {
                    if (!err && decoded) {
                        info.req.user = decoded;
                        cb(true);
                    } else {
                        console.log(err);
                        cb(false);
                    }
                });
            }
        }

        function verifyUser(u, p) {
            return true;
        }

        function authenticate(username, password) {

            if (verifyUser(username, password)) {
                return jwt.sign({
                    username: username
                }, secret);
            }
        }

        httpServer.listen(port, () => {
            that.wss.on('connection', (ws) => {
                that.emit('connection', ws);
                ws.on('message', (msg) => {
                    that.emit('message', msg);
                });
            }).on('error', (error)=> {
                that.emit('error', error);
            }).on('listening', ()=> {
                that.emit('listening');
            }).on('headers', ()=> {
                that.emit('headers');
            });
        });
    }

    broadcast(message) {
        this.wss.broadcast(message);
    }
}

module.exports = AuthenticatedWebSocketServer;

