var dateformat = require('dateformat');
var healthcheck = require("./");
var Table = require('cli-table');

healthcheck.init({
    servers: [
        'localhost:11114',
        'localhost:11115',
        'localhost:11116',
        'localhost:11117'
    ],
    delay: 2000,
    send: '/',
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
