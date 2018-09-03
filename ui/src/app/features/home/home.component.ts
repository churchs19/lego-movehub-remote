import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { ControlState } from '../movehub/models/controlState';
import { MovehubService } from '../movehub/movehub.service';

@Component({
    selector: 'movehub-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public message = '';
    public colorSensor: ReplaySubject<string>;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public controlState: ControlState = new ControlState(0, 0);

    constructor(private movehubService: MovehubService) {
        this.colorSensor = new ReplaySubject(1);
    }

    ngOnInit() {
        this.movehubService.deviceInfo.subscribe(deviceInfo => {
            deviceInfo.color ? this.colorSensor.next(deviceInfo.color) : this.colorSensor.next('');
            this.isConnected.next(deviceInfo.connected);
        });
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
