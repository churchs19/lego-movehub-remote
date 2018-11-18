import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

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
        let dialogRef: MatDialogRef<ConnectDialogComponent>;

        dialogRef = this.dialog.open(ConnectDialogComponent, {
            // disableClose: true
        });
    }
}
