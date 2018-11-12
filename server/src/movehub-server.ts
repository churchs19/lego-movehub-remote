import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';

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
