import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.router';
import { HomeModule } from './features/home/home.module';

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
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
