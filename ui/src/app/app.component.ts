import { Component, OnInit } from '@angular/core';

import { MovehubService } from '../features/movehub/movehub.service';

@Component({
    selector: 'movehub-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'movehub';
    message = '';

    constructor(private movehubService: MovehubService) {}

    ngOnInit() {
        this.movehubService.getMessage().subscribe(message => {
            if (this.message.length !== 0) {
                this.message += '\n';
            }
            this.message += message;
        });
    }

    public sendMessage() {
        this.movehubService.sendMessage('Hoping this works.');
    }
}
