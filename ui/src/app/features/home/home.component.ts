import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { MovehubService } from '../movehub/movehub.service';

@Component({
    selector: 'movehub-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public message = '';
    public colorSensor: ReplaySubject<string>;

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
        });
    }

    public drive() {
        this.movehubService.drive();
    }

    public stop() {
        this.movehubService.stop();
    }

    public disconnect() {
        this.movehubService.disconnect();
    }
}
