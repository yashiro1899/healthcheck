var Promise = require('es6-promise').Promise;

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

var healthcheck_status_shm = {
    owner: process.pid,
    action_time: null,
    concurrent: 0,
    since: null,
    last_down: true,
    down_code: 0,
    down: true
};
exports.init = function(opts) {
};
