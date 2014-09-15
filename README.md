It polls backends and if they respond with HTTP 200 + an optional request body, they are marked good.  Otherwise, they are marked bad.  Similar to haproxy/varnish health checks.

## new HealthCheck(options)

`options` can be an object.

Options:

* **servers**: An array containing servers to check.
* **delay**: Delay in msec between healthchecks. Defaults to `10000`.
* **timeout**: How long in msec a healthcheck is allowed to take place. Defaults to `2000`.
* **failcount**: Number of healthchecks good or bad in a row it takes to switch from down to up and back. Good to prevent flapping. Defaults to `2`.
* **send**:  What to send for the healthcheck. Defaults to `'/'`.
* **expected**: What to expect in the HTTP BODY, (meaning not the headers), in a correct response. If unset, just a HTTP 200 status code is required.
* **https**: If `true`, `https` indicates that uses https to health check. Defaults to `false`.
* **logger**: A function is invoked until every server finish in a healthcheck.

Example:

    var dateformat = require('dateformat');
    var HealthCheck = require("./").HealthCheck;
    var Table = require('cli-table');

    var instance = new HealthCheck({
        servers: [
            'localhost:3000',
            'localhost:3001'
        ],
        delay: 5000,
        timeout: 3000,
        failcount: 1,
        send: '/health.txt',
        expected: 'I_AM_ALIVE',
        https: true,
        logger: function(list) {
            var table = new Table({
                head: ['name', 'owner pid', 'action time', 'concurrent', 'since', "status", 'is down?']
            });
            var servers = Object.keys(list);

            servers.forEach(function(s) {
                var hc = list[s];
                var action_time = dateformat(hc.action_time, 'HH:MM:ss');
                var since = dateformat(hc.since, 'HH:MM:ss');
                table.push([s, hc.owner, action_time, hc.concurrent, since, hc.last_status, hc.down]);
            });
            console.log(table.toString());
        }
    });


## instance.status()

The `status()` method health status.

Example:

    {
        'localhost:3000': {
            action_time: Wed Sep 10 2014 15: 28: 20 GMT + 0800(CST),
            concurrent: 1,
            down: false,
            failcount: 1,
            last_status: 'connect ECONNREFUSED',
            owner: 2300,
            since: Wed Sep 10 2014 15: 28: 20 GMT + 0800(CST)
        },
        'localhost:3001': {
            action_time: Wed Sep 10 2014 15: 28: 20 GMT + 0800(CST),
            concurrent: 1,
            down: false,
            failcount: 1,
            last_status: 'connect ECONNREFUSED',
            owner: 2300,
            since: Wed Sep 10 2014 15: 28: 20 GMT + 0800(CST)
        }
    }

* **owner**: Worker pid processing this healthcheck.
* **action_time**: `Date` instance. Last time request was taken.
* **concurrent**: Number of concurrent bad or good responses.
* **since**: `Date` instance. How long this server's been concurrently bad or good.
* **last_status**: Status of last finished check.
* **down**: If true, the server is actually down.
* **failcount**: Number of concurrent bad responses.


## instance.is_down(name)

Return `true` if the given server has failed its healthcheck.

Example:

    instance.is_down("localhost:3000");
