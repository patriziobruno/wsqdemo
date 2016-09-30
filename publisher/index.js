'use strict';

var authenticatedws = require('authenticatedws');

module.exports = function publisher(options) {

    options = options || {aws: {port: 8080}};

    var count = 0;
    var aws = new authenticatedws.Client(options.aws);

    aws.connect();

    aws.on('open', ()=> {
        setInterval(() => {
            aws.send({payload: {count: count++}});
        }, 150);
    });
};