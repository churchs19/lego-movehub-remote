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
        // this.server.listen(this.port, () => {
        //     console.log('Running server on port %s', this.port);
        //     console.log('Waiting for client connection...');
        // });

        poweredUP.scan(); // Start scanning for hubs

        console.log('Looking for Hubs...');

        poweredUP.on('discover', async hub => {
            // Wait to discover hubs

            await hub.connect(); // Connect to hub
            console.log(`Connected to ${hub.name} of type ${PoweredUP.Consts.Hubs[hub.type]}!`);
            const controller = new HubController(hub);
            controller.init();
        });

        // let color = 1;
        // setInterval(() => {
        //     const hubs = poweredUP.getConnectedHubs(); // Get an array of all connected hubs
        //     hubs.forEach(hub => {
        //         console.log(`Battery Level: ${hub.batteryLevel}%`);
        //         if (hub.type === PoweredUP.Consts.Hubs.BOOST_MOVE_HUB) {
        //             (hub as PoweredUP.BoostMoveHub).setLEDColor(color); // Set the color
        //         }
        //     });
        //     color++;
        //     if (color > 10) {
        //         color = 1;
        //     }
        // }, 2000);

        // this.io.on('connect', (socket: any) => {
        //     const controller = new HubController(new DeviceInfo(), new ControlState());
        //     controller.start().subscribe(() => {
        //         console.log('Hub connected');
        //         controller.deviceInfo.subscribe(deviceInfo => {
        //             console.log('deviceInfo: ' + JSON.stringify(deviceInfo));
        //             this.io.emit('deviceInfo', deviceInfo);
        //         });

        //         socket.on('controlInput', (input: IControlState) => {
        //             controller.control = input;
        //         });

        //         socket.on('led', (color: MovehubAsync.LedColor) => {
        //             controller.led = color;
        //         });

        //         socket.on('disconnect', () => {
        //             console.log('Client disconnected');
        //             controller.disconnect().subscribe(() => {
        //                 console.log('Hub disconnected');
        //             });
        //         });
        //     });
        //     console.log('Connected client on port %s.', this.port);
        //     socket.on('message', (m: any) => {
        //         console.log('[server](message): %s', JSON.stringify(m));
        //         this.io.emit('message', m);
        //     });
        // });
    }
}
