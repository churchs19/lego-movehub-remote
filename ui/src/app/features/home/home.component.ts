import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { pairwise, take } from 'rxjs/operators';

import { ControlState } from '../movehub/models/control-state';
import { LedColor } from '../movehub/models/led-color';
import { MovehubService } from '../movehub/movehub.service';
import { ConnectDialogComponent } from '../connect-dialog/connect-dialog.component';

@Component({
    selector: 'movehub-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public knobOptions = {
        readOnly: false,
        size: 140,
        displayInput: false,
        valueformat: 'percent',
        min: 0,
        max: 2147483647,
        trackWidth: 19,
        barWidth: 20,
        trackColor: '#fff1b3',
        barColor: '#d01012',
        subText: {
            enabled: false
        }
    };

    public colorSensor: ReplaySubject<string>;
    public distance: ReplaySubject<number>;
    public ledColor: ReplaySubject<LedColor>;
    public ledColorControl: FormControl;
    public socketConnected = false;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public controlState: ControlState = new ControlState();

    constructor(private movehubService: MovehubService, private dialog: MatDialog) {
        this.colorSensor = new ReplaySubject<string>(1);
        this.distance = new ReplaySubject<number>(1);
        this.ledColor = new ReplaySubject<LedColor>(1);
        this.ledColorControl = new FormControl();
    }

    ngOnInit() {
        let dialogRef: MatDialogRef<ConnectDialogComponent>;
        this.movehubService.socketConnected.subscribe(connected => {
            this.socketConnected = connected;
            if (!connected) {
                this.isConnected.next(false);
            } else {
                dialogRef = this.dialog.open(ConnectDialogComponent);
            }
        });
        this.movehubService.deviceInfo.subscribe(deviceInfo => {
            if (dialogRef) {
                dialogRef.close();
            }
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
