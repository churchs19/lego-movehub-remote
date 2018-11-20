import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

import { ConnectDialogComponent } from '../connect-dialog/connect-dialog.component';
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

    constructor(private socket: Socket, private dialog: MatDialog) {
        this.ledColorControl = new FormControl();
        this.ledColorControl.disable();
    }

    ngOnInit() {
        const dialogRef = this.dialog.open(ConnectDialogComponent, {
            disableClose: true
        });

        this.socket.fromEvent<IHubState>('hubUpdated').subscribe(hubState => {
            this.isConnected.next(hubState.connected);
            console.log(`Hub ${hubState.name} updated.`);
            dialogRef.close();
        });
    }

    public toggleConnection() {
        if (this.isConnected.value) {
            this.socket.emit('disconnect');
        } else {
            this.socket.emit('connect');
        }
    }
}
