import { Component, OnInit } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

import { MovehubService } from '../movehub/movehub.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'movehub-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public message = '';
    public colorSensor: ReplaySubject<string>;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private movehubService: MovehubService) {
        this.colorSensor = new ReplaySubject(1);
    }

    ngOnInit() {
        this.movehubService.messages.subscribe(message => {
            if (this.message.length !== 0) {
                this.message += '\n';
            }
            this.message += 'Message received: ' + message;
        });

        this.movehubService.deviceInfo.subscribe(deviceInfo => {
            deviceInfo.color ? this.colorSensor.next(deviceInfo.color) : this.colorSensor.next('');
            this.isConnected.next(deviceInfo.connected);
        });
    }

    public drive() {
        this.movehubService.drive();
    }

    public stop() {
        this.movehubService.stop();
    }

    public toggleConnection() {
        this.isConnected.pipe(take(1)).subscribe(connected => {
            if (connected) {
                this.isConnected.next(false);
                this.movehubService.disconnect();
            } else {
                this.movehubService.connect();
            }
        });
    }
}
