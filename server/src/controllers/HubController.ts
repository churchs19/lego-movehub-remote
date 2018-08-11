import * as boost from 'movehub-async';
import { from, fromEvent, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { IControlData } from '../interfaces/IControlData';
import { IDeviceInfo } from '../interfaces/IDeviceInfo';

export class HubController {
    private hub: MovehubAsync.Hub;
    private device: IDeviceInfo;
    private control: IControlData;
    private prevControl: IControlData;

    constructor(deviceInfo: IDeviceInfo, controlData: IControlData) {
        this.hub = null;
        this.device = deviceInfo;
        this.control = controlData;
        this.prevControl = { ...this.control };

        // this.states = {
        //     Turn: turn.bind(this),
        //     Drive: drive.bind(this),
        //     Stop: stop.bind(this),
        //     Back: back.bind(this),
        //     Manual: manual.bind(this),
        //     Seek: seek.bind(this)
        // };

        // this.currentState = this.states['Drive'];
    }

    public start(): Observable<void> {
        return from(boost.getHubAsync()).pipe(
            take(1),
            map(hub => {
                this.device.connected = true;
                this.hub = hub;

                fromEvent(this.hub, 'error').subscribe((err: string) => {
                    this.device.error = err;
                });

                fromEvent(this.hub, 'disconnect').subscribe(() => {
                    this.device.connected = false;
                });

                fromEvent(this.hub, 'distance').subscribe((distance: number) => {
                    this.device.distance = distance;
                });

                fromEvent(this.hub, 'rssi').subscribe((rssi: number) => {
                    this.device.rssi = rssi;
                });

                fromEvent(this.hub, 'port').subscribe((action: MovehubAsync.IPortAction) => {
                    this.device.ports[action.port].action = action.action;
                });

                fromEvent(this.hub, 'color').subscribe((color: string) => {
                    this.device.color = color;
                });

                fromEvent(this.hub, 'tilt').subscribe((tilt: MovehubAsync.ITilt) => {
                    this.device.tilt.roll = tilt.roll;
                    this.device.tilt.pitch = tilt.pitch;
                });

                fromEvent(this.hub, 'rotation').subscribe((rotation: MovehubAsync.IPortRotation) => {
                    this.device.ports[rotation.port].angle = rotation.angle;
                });

                return;
            })
        );
    }

    public disconnect(): Observable<void> {
        if (this.device.connected && this.hub) {
            from(this.hub.disconnectAsync()).pipe(
                map(() => {
                    this.device.connected = false;
                })
            );
        } else {
            return of();
        }
    }
}
