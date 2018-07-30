"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socketIo = require("socket.io");
class MovehubServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || MovehubServer.PORT;
        this.server = http_1.createServer(this.app);
        this.io = socketIo(this.server);
        this.listen();
    }
    getApp() {
        return this.app;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}
MovehubServer.PORT = 8080;
exports.MovehubServer = MovehubServer;
//# sourceMappingURL=movehub-server.js.map