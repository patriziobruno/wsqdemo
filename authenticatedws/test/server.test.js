'use strict';

var should = require('should');
var mockups = require('./mockups');
var server = require('../lib/server');

describe('authenticated web sockets server', ()=> {

    describe('after instantiated', () => {

        it('should raise the "connection" event when accepts a connection', (done) => {
            var aws = new server();
            aws.on('connection', (connection)=> {
                should(connection).not.be.null();
                should(connection).not.be.undefined();
                should(connection).be.instanceOf(mockups.ws);
                done();
            });
        });

        it('should raise and event "message" when receives a message', (done) => {
            var aws = new server();
            aws.on('message', (message)=> {
                message.should.be.equal('test');
                done();
            });
        });

        it('should send broadcasts to connected clients', (done) => {
            var aws = new server();
            aws.on('connection', (connection)=> {
                should(connection).not.be.null();
                should(connection).not.be.undefined();
                should(connection).be.instanceOf(mockups.ws);

                mockups.testData.done = function(message) {
                    mockups.resetTestData();
                    should(message).be.equal('test');
                    done();
                };

                aws.broadcast('test');
            });
        });
    });
});

