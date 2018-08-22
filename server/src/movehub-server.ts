import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';

import { HubController } from './controllers/hub-controller';
import { IControlState } from './interfaces/IControlState';
import { ControlState } from './model/control-state';
import { DeviceInfo } from './model/device-info';

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
        });

        this.io.on('connect', (socket: any) => {
            const controller = new HubController(new DeviceInfo(), new ControlState());
            controller.start().subscribe(() => {
                console.log('Hub connected');
                this.io.emit('message', 'Hub connected');
                controller.deviceInfo.subscribe(deviceInfo => {
                    console.log('deviceInfo: ' + JSON.stringify(deviceInfo));
                    this.io.emit('deviceInfo', deviceInfo);
                });
            });
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: any) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('controlInput', (input: IControlState) => {
                console.log('controlInput: ' + JSON.stringify(input));
                controller.control = input;
            });

            socket.on('disconnect', () => {
                controller.disconnect();
                console.log('Client disconnected');
            });
        });
    }
}
