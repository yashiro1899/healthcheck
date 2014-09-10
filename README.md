It polls backends and if they respond with HTTP 200 + an optional request body, they are marked good.  Otherwise, they are marked bad.  Similar to haproxy/varnish health checks.

## healthcheck.init(options)

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



    	var dateformat = require('dateformat');
    	var healthcheck = require("healthcheck");
    	var Table = require('cli-table');

		healthcheck.init({
        	servers: [
            	'localhost:3000',
            	'localhost:3001'
        	],
        	delay: 2000,
        	send: '/health.txt',
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
