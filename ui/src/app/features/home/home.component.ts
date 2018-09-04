import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take, pairwise } from 'rxjs/operators';

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
    public socketConnected = false;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public controlState: ControlState = new ControlState();

    constructor(private movehubService: MovehubService) {
        this.colorSensor = new ReplaySubject(1);
    }

    ngOnInit() {
        this.movehubService.socketConnected.subscribe(connected => {
            this.socketConnected = connected;
            if (!connected) {
                this.isConnected.next(false);
            }
        });
        this.movehubService.deviceInfo.subscribe(deviceInfo => {
            deviceInfo.color ? this.colorSensor.next(deviceInfo.color) : this.colorSensor.next('');
            this.isConnected.next(deviceInfo.connected && this.socketConnected);
        });
        this.isConnected.pipe(pairwise()).subscribe(connected => {
            if (connected[0] !== connected[1]) {
                this.controlState.motorA = 0;
                this.controlState.motorB = 0;
            }
        });
    }

    public updateInput() {
        this.movehubService.updateInput(this.controlState);
    }

    public stop() {
        this.controlState.motorA = 0;
        this.controlState.motorB = 0;
        this.updateInput();
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
