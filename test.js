var dateformat = require('dateformat');
var healthcheck = require("./");
var Table = require('cli-table');

healthcheck.init({
    servers: [
        'user.qunar.com',
    ],
    https: true,
    delay: 2000,
    send: '/passport/login.jsp',
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
