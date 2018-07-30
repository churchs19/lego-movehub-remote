import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class MovehubService {
    constructor(private socket: Socket) {}

    sendMessage(msg: string) {
        this.socket.emit('message', msg);
    }
    getMessage() {
        return this.socket.fromEvent<any>('message').pipe(
            map(data => {
                console.log('Message received: ' + JSON.stringify(data));
                return data.msg;
            })
        );
    }
}
