var Promise = require('es6-promise').Promise;
var http = require("http");
var https = require("https");

var HEALTH_STATE = [
    "OK",                                      // HEALTH_OK
    "Malformed header",                        // HEALTH_BAD_HEADER
    "Bad status line.  Maybe not HTTP",        // HEALTH_BAD_STATUS
    "Bad HTTP body contents",                  // HEALTH_BAD_BODY
    "Internal error.  Bad healthcheck state",  // HEALTH_BAD_STATE
    "Error reading contents.  Bad connection", // HEALTH_BAD_CONN
    "Non 200 HTTP status code",                // HEALTH_BAD_CODE
    "Healthcheck timed out",                   // HEALTH_TIMEOUT
    "Contents could not fit read buffer",      // HEALTH_FULL_BUFFER
    "Connection closed early"                  // HEALTH_EARLY_CLOSE
];


// var healthcheck_status_shm = {
//     action_time: null,
//     concurrent: 0,
//     down: false,
//     down_code: 0,
//     last_down: true,
//     owner: process.pid,
//     since: null
// };
var healthchecks_arr = [];

exports.init = function(opts) {
    if (opts && opts.peers && opts.peers.length > 0) {
        if (opts.delay === undefined) opts.delay = 10000;
        if (opts.failcount === undefined) opts.failcount = 2;
        if (opts.timeout === undefined) opts.timeout = 2000;
    }
};

exports.healthcheck_add_peer = function(peer) {
};

exports.healthcheck_is_down = function(index) {
};
