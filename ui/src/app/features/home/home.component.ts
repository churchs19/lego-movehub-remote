import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { ConnectDialogComponent } from '../connect-dialog/connect-dialog.component';
import { Colors } from '../consts';
import { IHubState } from '../interfaces/IHubState';

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
        min: -30,
        max: 30,
        trackWidth: 19,
        barWidth: 20,
        trackColor: '#fff1b3',
        barColor: '#d01012',
        startAngle: 240,
        endAngle: 120,
        subText: {
            enabled: false
        }
    };

    public colorSensor: ReplaySubject<string>;
    public distance: ReplaySubject<number>;
    public ledColor: ReplaySubject<Colors>;
    public ledColorControl: FormControl;
    public socketConnected = false;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public batteryLevel: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

    private hubName: string;

    constructor(private socket: Socket, private dialog: MatDialog) {
        this.colorSensor = new ReplaySubject<string>(1);
        this.distance = new ReplaySubject<number>(1);
        this.ledColor = new ReplaySubject<Colors>(1);
        this.ledColorControl = new FormControl();
        this.ledColorControl.setValue(Colors.Blue);
        this.ledColorControl.disable();
    }

    ngOnInit() {
        let dialogRef: MatDialogRef<ConnectDialogComponent>;

        this.socket.fromEvent<IHubState>('hubUpdated').subscribe(hubState => {
            console.log(`Hub ${hubState.name} updated.`);
            this.hubName = hubState.name;
            this.isConnected.next(hubState.connected);
            this.batteryLevel.next(hubState.batteryLevel);
            this.colorSensor.next(Colors[hubState.color]);
            this.distance.next(hubState.distance);
        });

        this.isConnected.pipe(distinctUntilChanged()).subscribe(connected => {
            if (!connected) {
                dialogRef = this.dialog.open(ConnectDialogComponent, {
                    disableClose: true
                });
                this.ledColorControl.disable();
            } else {
                if (dialogRef) {
                    dialogRef.close();
                }
                this.ledColorControl.enable();
                this.ledColorControl.setValue(Colors.Blue);
            }
        });

        this.ledColorControl.valueChanges.subscribe((value: Colors) => {
            this.setLed(value);
        });
    }

    public toggleConnection() {
        if (this.isConnected.value) {
            this.socket.emit('disconnect');
        } else {
            this.socket.emit('connect');
        }
    }

    public get batteryIcon(): Observable<string> {
        return this.batteryLevel.pipe(
            map(it => {
                let battery = 'battery_unknown';
                battery = it >= 0 ? 'battery_alert' : battery;
                battery = it > 10 ? 'battery_20' : battery;
                battery = it > 20 ? 'battery_30' : battery;
                battery = it > 30 ? 'battery_50' : battery;
                battery = it > 50 ? 'battery_60' : battery;
                battery = it > 60 ? 'battery_80' : battery;
                battery = it > 80 ? 'battery_90' : battery;
                battery = it > 90 ? 'battery_full' : battery;

                return battery;
            })
        );
    }

    public get ledColorClass(): string {
        return Colors[this.ledColorControl.value];
    }

    public setLed(color: Colors) {
        this.ledColor.next(color);
        this.socket.emit('led', {
            hubName: this.hubName,
            color: color
        });
    }

    public setMotorSpeed(port: string, speed: number) {
        this.socket.emit('motorSpeed', {
            hubName: this.hubName,
            port: port,
            speed: speed
        });
    }

    public setMotorAngle(port: string, angle: number, speed?: number) {
        this.socket.emit('motorAngle', {
            hubName: this.hubName,
            port: port,
            angle: angle,
            speed: speed
        });
    }

    public stop() {
        this.setMotorSpeed('AB', 0);
    }

    // public toggleExternalMotor(event: MatSlideToggleChange) {
    //     if (event.checked) {
    //         this.setMotorSpeed('C', 100);
    //     } else {
    //         this.setMotorSpeed('C', 0);
    //     }
    // }

    public setHeadAngle() {
        this.setMotorAngle('D', 30, -50);
    }
}
