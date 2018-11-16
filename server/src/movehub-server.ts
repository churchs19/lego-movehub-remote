import * as express from 'express';
import { createServer, Server } from 'http';
import PoweredUP = require('node-poweredup');
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as socketIo from 'socket.io';
import { ITiltEvent } from './interfaces/ITiltEvent';

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

            hub.on('button', (button: string, state: PoweredUP.Consts.ButtonStates) => {
                console.log(`${hub.name} button ${button} state ${PoweredUP.Consts.ButtonStates[state]}`);
            });

            hub.on('distance', (port: string, distance: number) => {
                console.log(`${hub.name} detected distance of ${distance}mm on port ${port}`);
            });

            hub.on('color', (port: string, detectedColor: PoweredUP.Consts.Colors) => {
                console.log(
                    `${hub.name} detected color of ${PoweredUP.Consts.Colors[detectedColor]}mm on port ${port}`
                );
            });

            fromEvent<ITiltEvent>(hub, 'tilt').pipe(
                debounceTime(1000)
            ).subscribe((eventData) => {
                console.log(`${hub.name} detected tilt of (${eventData.x},${eventData.y}) on port ${eventData.port}`);
            });

            hub.on('rotate', (port: string, rotation: number) => {
                console.log(`${hub.name} detected rotation of ${rotation} on port ${port}`);
            });

            hub.on('attach', (port: string, type: PoweredUP.Consts.Devices) => {
                console.log(`${hub.name} connected ${PoweredUP.Consts.Devices[type]} on port ${port}`);
            });

            hub.on('detach', (port: string) => {
                console.log(`${hub.name} disconnected device on port ${port}`);
            });

            hub.on('disconnect', () => {
                console.log(`Hub ${hub.name} disconnected`);
            });
        });

        let color = 1;
        setInterval(() => {
            const hubs = poweredUP.getConnectedHubs(); // Get an array of all connected hubs
            hubs.forEach(hub => {
                console.log(`Battery Level: ${hub.batteryLevel}%`);
                if (hub.type === PoweredUP.Consts.Hubs.BOOST_MOVE_HUB) {
                    (hub as PoweredUP.BoostMoveHub).setLEDColor(color); // Set the color
                }
            });
            color++;
            if (color > 10) {
                color = 1;
            }
        }, 2000);

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
