import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { IDeviceInfo } from './interfaces/IDeviceInfo';
import { ControlState } from './models/controlState';

@Injectable()
export class MovehubService {
    constructor(private socket: Socket) {}

    sendMessage(message: string) {
        this.socket.emit('message', message);
    }

    public connect() {
        this.socket.connect();
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public get messages(): Observable<string> {
        return this.socket.fromEvent<any>('message').pipe(
            map(data => {
                console.log('Message received: ' + JSON.stringify(data));
                return data;
            })
        );
    }

    public get deviceInfo(): Observable<IDeviceInfo> {
        return this.socket.fromEvent<IDeviceInfo>('deviceInfo').pipe(
            map(info => {
                console.log('Device info: ' + JSON.stringify(info));
                return info;
            })
        );
    }

    public drive() {
        const controlState = new ControlState(50, 0);
        this.socket.emit('controlInput', controlState);
    }

    public stop() {
        const controlState = new ControlState(0, 0);
        this.socket.emit('controlInput', controlState);
    }
}
