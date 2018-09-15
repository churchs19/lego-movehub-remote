import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take, pairwise } from 'rxjs/operators';

import { ControlState } from '../movehub/models/control-state';
import { MovehubService } from '../movehub/movehub.service';
import { LedColor } from '../movehub/models/led-color';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'movehub-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public message = '';
    public colorSensor: ReplaySubject<string>;
    public distance: ReplaySubject<number>;
    public ledColor: ReplaySubject<LedColor>;
    public ledColorControl: FormControl;
    public socketConnected = false;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public controlState: ControlState = new ControlState();

    constructor(private movehubService: MovehubService) {
        this.colorSensor = new ReplaySubject<string>(1);
        this.distance = new ReplaySubject<number>(1);
        this.ledColor = new ReplaySubject<LedColor>(1);
        this.ledColorControl = new FormControl();
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
            this.distance.next(deviceInfo.distance);
            this.isConnected.next(deviceInfo.connected && this.socketConnected);
        });
        this.isConnected.pipe(pairwise()).subscribe(connected => {
            if (connected[0] !== connected[1]) {
                this.ledColorControl.setValue(LedColor.Blue);
                this.controlState.motorA = 0;
                this.controlState.motorB = 0;
            }
        });
        this.ledColorControl.valueChanges.subscribe((value: LedColor) => {
            this.setLed(value);
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

    public setLed(color: LedColor) {
        this.ledColor.next(color);
        this.movehubService.ledColor = color;
    }
}
