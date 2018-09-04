import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDeviceInfo } from './interfaces/IDeviceInfo';
import { ControlState } from './models/controlState';

@Injectable()
export class MovehubService {
    public controlState: ControlState = new ControlState(0, 0);

    constructor(private socket: Socket) {}

    public get socketConnected(): Observable<boolean> {
        const connect = fromEvent(this.socket.ioSocket, 'connect').pipe(
            map(() => {
                return true;
            })
        );
        const disconnect = fromEvent(this.socket.ioSocket, 'disconnect').pipe(
            map(reason => {
                console.log('Socket disconnected: ' + reason);
                return false;
            })
        );
        return merge(connect, disconnect);
    }

    public connect() {
        this.socket.connect();
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public updateInput(controlState: ControlState) {
        this.socket.emit('controlInput', controlState);
    }

    public get deviceInfo(): Observable<IDeviceInfo> {
        return this.socket.fromEvent<IDeviceInfo>('deviceInfo').pipe(
            map(info => {
                return info;
            })
        );
    }
}
