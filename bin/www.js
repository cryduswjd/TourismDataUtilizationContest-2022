"use strict";

const app = require('../app');
const http = require('http');
const port = process.env.S_PORT || 3000;
const server = http.createServer(app);
server.listen(port, () => {
    console.log('Server on ' + port);
});