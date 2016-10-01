'use strict';

var mockups = require('./mockups');
var should = require('should');
var jwt = require('jsonwebtoken');
var client = require('../lib/client');

describe('authenticated web sockets client', ()=> {

  describe('#connect', () => {

    it('should raise the "open" event once connected', (done) => {
      var aws = new client();
      aws.on('open', ()=> {
        done();
      });
      aws.connect();
    });

    it('should raise the "error" event when the login request times out', (done) => {
      var aws = new client({host: 'request_timeout_expected'});

      aws.on('open', ()=> {
        done(new Error('requestTimeout expected'));
      });
      aws.on('error', (err)=> {
        should(err).be.instanceOf(Error);
        should(err.message).be.equal('request timeout');
        done();
      });
      aws.connect();
    });

    it('should raise the "error" event when the login response times out', (done) => {
      var aws = new client({host: 'response_timeout_expected'});

      aws.on('open', ()=> {
        done(new Error('responseTimeout expected'));
      });
      aws.on('error', (err)=> {
        should(err).be.instanceOf(Error);
        should(err.message).be.equal('response timeout');
        done();
      });
      aws.connect();
    });

    it('should raise the "error" event when an error is raised by node_rest_client', (done) => {
      var aws = new client({host: 'error_expected'});

      aws.on('open', ()=> {
        done(new Error('error expected'));
      });

      aws.on('error', (err)=> {
        should(err).be.instanceOf(Error);
        done();
      });
      aws.connect();
    });

    it('should raise the "message" event when a message is received by WebSocket', (done) => {
      var aws = new client({host: 'message_expected'});

      aws.on('error', (err)=> {
        done(err);
      });

      aws.on('message', (msg)=> {
        should(msg).be.equal('message');
        done();
      });
      aws.connect();
    });
  });

  describe('verify_auth@connect', () => {
    it('the "open" event data should be a vaid JWT token containing a user info object', (done)=> {
      var aws = new client({username: 'test', password: 'test'});
      aws.on('open', (token)=> {
        jwt.verify(token, 'pbruno4demo', (err, decoded)=> {
          should(err).be.null();
          should(decoded).be.not.null();
          should(decoded).be.not.undefined();

          should(decoded.username).be.equal('test');
          done();
        });
      });
      aws.connect();
    });

    it('should emit a "login_error" event on wrong credentials', (done)=> {
      var aws = new client({username: 'wrong', password: 'credentials'});
      aws.connect();
      aws.on('open', ()=> {
        done(new Error('no login_error even using wrong credentials'));
      });
      aws.on('login_error', (err)=> {
        should(err).be.instanceOf(Error);
        should(err.code).be.equal(401);
        done();
      });
    });
  });
});
