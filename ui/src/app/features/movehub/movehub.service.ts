import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { IDeviceInfo } from './interfaces/IDeviceInfo';
import { ControlState } from './models/controlState';

@Injectable()
export class MovehubService {
    public controlState: ControlState = new ControlState(0, 0);

    constructor(private socket: Socket) {}

    public connect() {
        this.socket.connect();
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public get deviceInfo(): Observable<IDeviceInfo> {
        return this.socket.fromEvent<IDeviceInfo>('deviceInfo').pipe(
            map(info => {
                console.log('Device info: ' + JSON.stringify(info));
                return info;
            })
        );
    }

    public stop() {
        const controlState = new ControlState(0, 0);
        this.socket.emit('controlInput', controlState);
    }
}
