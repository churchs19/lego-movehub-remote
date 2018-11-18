import * as express from 'express';
import { createServer, Server } from 'http';
import PoweredUP = require('node-poweredup');
import * as socketIo from 'socket.io';

import { HubController } from './controllers/hubController';

const poweredUP = new PoweredUP.PoweredUP();

export class MovehubServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || MovehubServer.PORT;
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
        this.listen();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
            console.log('Waiting for client connection...');

            poweredUP.scan(); // Start scanning for hubs

            console.log('Looking for Hubs...');

            poweredUP.on('discover', async hub => {
                // Wait to discover hubs

                await hub.connect(); // Connect to hub
                console.log(`Connected to ${hub.name} of type ${PoweredUP.Consts.Hubs[hub.type]}!`);
                const controller = new HubController(hub);
                controller.init();
            });
        });

        this.io.on('connect', (socket: any) => {
            console.log('Client connected...');
        });
    }
}
