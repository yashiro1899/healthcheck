var healthcheck = require("./");

healthcheck.init({
    servers: [
        'localhost:11114',
        'localhost:11115',
        'localhost:11116',
        'localhost:11117'
    ],
    delay: 2000,
    send: '/health.txt',
    logger: console.log
});
