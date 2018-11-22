import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        min: 0,
        max: 360,
        trackWidth: 19,
        barWidth: 20,
        trackColor: '#fff1b3',
        barColor: '#d01012',
        subText: {
            enabled: false
        }
    };

    public ledColorControl: FormControl;
    public socketConnected = false;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public batteryLevel: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

    constructor(private socket: Socket, private dialog: MatDialog) {
        this.ledColorControl = new FormControl();
        this.ledColorControl.disable();
    }

    ngOnInit() {
        // const dialogRef = this.dialog.open(ConnectDialogComponent, {
        //     disableClose: true
        // });

        this.socket.fromEvent<IHubState>('hubUpdated').subscribe(hubState => {
            this.isConnected.next(hubState.connected);
            console.log(`Hub ${hubState.name} updated.`);
            this.batteryLevel.next(hubState.batteryLevel);
//            dialogRef.close();
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
}
