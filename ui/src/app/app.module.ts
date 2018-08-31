import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.router';
import { HomeModule } from './features/home/home.module';
import { GestureConfig } from '@angular/material';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
    declarations: [AppComponent],
    imports: [
        HomeModule,
        AppRoutes,
        BrowserModule,
        BrowserAnimationsModule,
        SocketIoModule.forRoot(config),
        RouterModule
    ],
    providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }],
    bootstrap: [AppComponent]
})
export class AppModule {}
