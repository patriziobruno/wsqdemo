'use strict';

require('./mockups');
var should = require('should');
var jwt = require('jsonwebtoken');
var client = require('../lib/client');

describe('authenticated web sockets client', ()=> {

    describe('after instantiated', () => {
        it('should raise the "open" event once connected', (done) => {
            var aws = new client();
            aws.connect();
            aws.on('open', ()=> {
                done();
            });
        });
    });

    describe('verify_auth', () => {
        it('the "open" event data should be a vaid JWT token containing a user info object', (done)=> {
            var aws = new client({username: 'test', password: 'test'});
            aws.connect();
            aws.on('open', (token)=> {
                var obj = jwt.verify(token, 'pbruno4demo', (err, decoded)=> {
                    should(err).be.null();
                    should(decoded).be.not.null();
                    should(decoded).be.not.undefined();

                    should(decoded.username).be.equal('test');
                    done();
                });
            });
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
