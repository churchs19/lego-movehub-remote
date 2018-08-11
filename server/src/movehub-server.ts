import * as express from 'express';
import { createServer, Server } from 'http';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import * as socketIo from 'socket.io';

import { LedColor } from './ledColor';
import { MovehubService } from './movehub-service';

export class MovehubServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private movehubService: MovehubService;

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
            this.movehubService = new MovehubService();
            this.movehubService.bleReady.subscribe(ready => {
                console.log('BLE Ready: ' + ready);
            });
            this.movehubService.hubFound.subscribe(details => {
                console.log('Hub found: ' + JSON.stringify(details));
                this.io.emit('message', 'hub found');
            });
            this.movehubService.hub.subscribe(hub => {
                console.log('Hub connected');
                this.io.emit('message', 'Hub connected');

                const counter = timer(0, 2000);
                counter.pipe(take(200)).subscribe(x => {
                    if (x % 2 === 0) {
                        this.movehubService.led(LedColor.purple).subscribe(() => {});
                    } else {
                        this.movehubService.led(LedColor.orange).subscribe(() => {});
                    }
                });
            });
            this.movehubService.init();
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: any) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}
