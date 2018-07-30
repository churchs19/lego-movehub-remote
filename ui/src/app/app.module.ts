import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { MovehubModule } from '../features/movehub/movehub.module';
import { AppComponent } from './app.component';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
    declarations: [AppComponent],
    imports: [MovehubModule, BrowserModule, SocketIoModule.forRoot(config)],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
