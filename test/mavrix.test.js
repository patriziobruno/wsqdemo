'use strict';

require('./mockups');
var should = require('should');

var collector = require('../collector');
var dispatcher = require('../dispatcher');
var publisher = require('../publisher');
var subscriber = require('../subscriber');

describe('run all', ()=> {

    it('start collector', (done)=> {
        new collector();
        done();
    });

    it('start dispatcher', (done)=> {
        new dispatcher();
        done();
    });


    it('start publisher', (done)=> {
        publisher();
        done();
    });

    it('subscriber should receive 4 messages in a row', (done)=> {
        setTimeout(()=> {
            var count = 0;

            var subs = new subscriber();
            subs.on('message', (data) => {
                should(data).be.not.null();
                should(data.payload).be.not.null();

                data.payload.count.should.be.equal(count);

                if (++count == 4)
                    done();
            });

            subs.on('error', (err)=> {
                done(err);
            });
        }, 100);
    });
});
