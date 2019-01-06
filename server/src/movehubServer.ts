import * as express from 'express';
import { createServer, Server } from 'http';
import PoweredUP = require('node-poweredup');
import * as socketIo from 'socket.io';

import { HubController } from './controllers/hubController';
import { ILedRequest } from './interfaces/ILedRequest';
import { IMotorAngleRequest } from './interfaces/IMotorAngleRequest';
import { IMotorSpeedRequest } from './interfaces/IMotorSpeedRequest';
import { HubControllerCollection } from './model/hubControllerCollection';

export class MovehubServer {
    public static readonly PORT: number = 8080;

    private poweredUP = new PoweredUP.PoweredUP();

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private hubControllers = new HubControllerCollection();

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

            this.poweredUP.scan(); // Start scanning for hubs

            console.log('Looking for Hubs...');

            this.poweredUP.on('discover', async hub => {
                // Wait to discover hubs

                await hub.connect(); // Connect to hub
                console.log(`Connected to ${hub.name} of type ${PoweredUP.Consts.HubType[hub.type]}!`);
                const controller = new HubController(hub);
                this.hubControllers[hub.name] = controller;
                controller.hubState.subscribe(hubState => {
                    this.io.emit('hubUpdated', hubState);
                });
                controller.init();
            });
        });

        this.io.on('connect', (socket: socketIo.Socket) => {
            console.log('Client connected...');

            Object.getOwnPropertyNames(this.hubControllers).map(name => {
                this.io.emit('hubUpdated', this.hubControllers[name].hubState.getValue());
            });

            socket.on('motorSpeed', (request: IMotorSpeedRequest) => {
                if (this.hubControllers[request.hubName]) {
                    this.hubControllers[request.hubName].setMotorSpeed(request);
                }
            });

            socket.on('motorAngle', (request: IMotorAngleRequest) => {
                if (this.hubControllers[request.hubName]) {
                    this.hubControllers[request.hubName].setMotorAngle(request);
                }
            });

            socket.on('led', (request: ILedRequest) => {
                if (this.hubControllers[request.hubName]) {
                    this.hubControllers[request.hubName].setLed(request);
                }
            });
        });
    }
}
