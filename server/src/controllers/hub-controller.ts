import * as boost from 'movehub-async';
import { BehaviorSubject, from, fromEvent, Observable, of, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { IControlState } from '../interfaces/IControlState';
import { IDeviceInfo } from '../interfaces/IDeviceInfo';

export class HubController {
    public deviceInfo: BehaviorSubject<IDeviceInfo>;

    private hub: MovehubAsync.Hub;
    private device: IDeviceInfo;
    private control: ReplaySubject<IControlState>;

    constructor(deviceInfo: IDeviceInfo, controlState: IControlState) {
        this.hub = null;
        this.deviceInfo = new BehaviorSubject(deviceInfo);
        this.device = deviceInfo;
        this.control = new ReplaySubject<IControlState>(2);
        this.control.next(controlState);
    }

    public start(): Observable<void> {
        return from(boost.getHubAsync()).pipe(
            take(1),
            map(hub => {
                this.device.connected = true;
                this.deviceInfo.next(this.device);
                this.hub = hub;

                fromEvent(this.hub, 'error').subscribe((err: string) => {
                    this.device.error = err;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'disconnect').subscribe(() => {
                    this.device.connected = false;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'distance').subscribe((distance: number) => {
                    this.device.distance = distance;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'rssi').subscribe((rssi: number) => {
                    this.device.rssi = rssi;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'port').subscribe((action: MovehubAsync.IPortAction) => {
                    this.device.ports[action.port].action = action.action;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'color').subscribe((color: string) => {
                    this.device.color = color;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'tilt').subscribe((tilt: MovehubAsync.ITilt) => {
                    this.device.tilt.roll = tilt.roll;
                    this.device.tilt.pitch = tilt.pitch;
                    this.deviceInfo.next(this.device);
                });

                fromEvent(this.hub, 'rotation').subscribe((rotation: MovehubAsync.IPortRotation) => {
                    this.device.ports[rotation.port].angle = rotation.angle;
                    this.deviceInfo.next(this.device);
                });

                return;
            })
        );
    }

    public disconnect(): Observable<void> {
        if (this.device.connected && this.hub) {
            return from(this.hub.disconnectAsync()).pipe(
                map(() => {
                    this.device.connected = false;
                    this.deviceInfo.next(this.device);
                    this.deviceInfo.complete();
                    this.control.complete();
                })
            );
        } else {
            this.deviceInfo.complete();
            this.control.complete();
            return of();
        }
    }

    public updateHub(): Observable<void> {
        return this.control.pipe(
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

            return from(this.hub.motorTimeMultiAsync(60, motorA, motorB));
        } else {
            return of();
        }
    }
}
