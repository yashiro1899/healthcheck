var http = require("http");
var https = require("https");
var url = require("url");

var HEALTH_STATE = [
    "OK",                                      // 0. HEALTH_OK
    "Malformed header",                        // 1. HEALTH_BAD_HEADER
    "Bad status line.  Maybe not HTTP",        // 2. HEALTH_BAD_STATUS
    "Bad HTTP body contents",                  // 3. HEALTH_BAD_BODY
    "Internal error.  Bad healthcheck state",  // 4. HEALTH_BAD_STATE
    "Error reading contents.  Bad connection", // 5. HEALTH_BAD_CONN
    "Non 200 HTTP status code",                // 6. HEALTH_BAD_CODE
    "Healthcheck timed out",                   // 7. HEALTH_TIMEOUT
    "Contents could not fit read buffer",      // 8. HEALTH_FULL_BUFFER
    "Connection closed early"                  // 9. HEALTH_EARLY_CLOSE
];


var healthchecks_arr = {};

exports.init = function(opts) {
    if (opts && opts.servers && opts.servers.length > 0) {
        if (opts.delay === undefined) opts.delay = 10000;
        if (opts.failcount === undefined) opts.failcount = 2;
        if (opts.timeout === undefined) opts.timeout = 2000;

        opts.servers.forEach(function(s) {
            healthchecks_arr[s] = {
                action_time: null,
                concurrent: 0,
                down: false,
                failcount: 0,
                last_status: "",
                owner: process.pid,
                since: null
            };
        });

        delete opts.servers;
        this.opts = opts;
        check();
        setInterval(check, opts.delay);
    }
};

exports.is_down = function(name) {
    var hc = healthchecks_arr[name];
    if (hc) {
        return hc.down;
    } else {
        return new Error("healthcheck: Invalid index to is_down: " + name);
    }
};

exports.status = function() {
    return healthchecks_arr;
};

function check() {
    var servers = Object.keys(healthchecks_arr);
    var opts = exports.opts;

    servers.forEach(function(s) {
        var time = new Date();
        var hc = healthchecks_arr[s];
        if (!hc.since) hc.since = time;
        hc.action_time = time;
        hc.concurrent += 1;

        var u = url.format({
            protocol: (opts.https ? 'https:' : 'http:'),
            host: s,
            path: (opts.send || "/")
        });
        u = url.parse(u);
        var ended = false;

        var library = opts.https ? https : http;
        var request = library.get({
            host: u.hostname,
            port: u.port,
            agent: false,
            path: u.pathname
        }, function(response) {
            var result = new Buffer('');
            if (response.statusCode == 200) {
                response.on("data", function(chunk) {
                    result = Buffer.concat([result, chunk]);
                });
                response.on("end", function() {
                    if (ended) return null;
                    if (opts.expected) {
                        console.log(result.toString(), opts.expected);
                        if (opts.expected == result.toString()) {
                            hc.last_status = HEALTH_STATE[0];
                            hc.failcount = 0;
                            hc.down = false;
                        } else {
                            hc.last_status = HEALTH_STATE[3];
                            hc.failcount += 1;
                            if (hc.failcount > opts.failcount) hc.down = true;
                        }
                    } else {
                        hc.last_status = HEALTH_STATE[0];
                        hc.failcount = 0;
                        hc.down = false;
                    }
                });
            } else {
                hc.last_status = HEALTH_STATE[6];
                hc.failcount += 1;
                if (hc.failcount > opts.failcount) hc.down = true;
            }
        });

        request.on('socket', function(socket) {
            socket.setTimeout(opts.timeout);
            socket.on('timeout', function() {
                ended = true;
                request.abort();
                hc.last_status = HEALTH_STATE[7];
                hc.failcount += 1;
                if (hc.failcount > opts.failcount) hc.down = true;
            });
        });

        request.on('error', function(error) {
            ended = true;
            hc.last_status = error.message;
            hc.failcount += 1;
            if (hc.failcount > opts.failcount) hc.down = true;
        });
    });
    if (typeof opts.logger === "function") opts.logger(healthchecks_arr);
}
