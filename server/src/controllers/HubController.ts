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

    public updateHub() {
        if (this.control.speed !== this.prevControl.speed || this.control.turnAngle !== this.prevControl.turnAngle) {
            let motorA = this.control.speed + (this.control.turnAngle > 0 ? Math.abs(this.control.turnAngle) : 0);
            let motorB = this.control.speed + (this.control.turnAngle < 0 ? Math.abs(this.control.turnAngle) : 0);

            if (motorA > 100) {
                motorB -= motorA - 100;
                motorA = 100;
            }

            if (motorB > 100) {
                motorA -= motorB - 100;
                motorB = 100;
            }

            this.control.motorA = motorA;
            this.control.motorB = motorB;

            this.hub.motorTimeMulti(60, motorA, motorB);
        }
    }
}
