import * as boost from 'movehub-async';
import { BehaviorSubject, from, fromEvent, Observable, of, Subject, timer } from 'rxjs';
import { combineLatest, map, pairwise, take, takeUntil } from 'rxjs/operators';

import { IControlState } from '../interfaces/IControlState';
import { IDeviceInfo } from '../interfaces/IDeviceInfo';

export class HubController {
    public deviceInfo: BehaviorSubject<IDeviceInfo>;

    private hub: MovehubAsync.Hub;
    private device: IDeviceInfo;
    private _control: BehaviorSubject<IControlState>;
    private timer: Observable<number>;
    private unsubscribe: Subject<boolean>;

    constructor(deviceInfo: IDeviceInfo, controlState: IControlState) {
        this.hub = null;
        this.unsubscribe = new Subject<boolean>();
        this.deviceInfo = new BehaviorSubject(deviceInfo);
        this.device = deviceInfo;
        this._control = new BehaviorSubject<IControlState>(controlState);
        this.timer = timer(50, 50);
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

                this.subscribeControl();

                return;
            })
        );
    }

    public disconnect(): Observable<void> {
        if (this.device.connected && this.hub) {
            return from(this.hub.disconnectAsync()).pipe(
                map(() => {
                    this.unsubscribe.next(true);
                    this.unsubscribe.complete();
                    this.device.connected = false;
                    this.deviceInfo.next(this.device);
                    this.deviceInfo.complete();
                    this._control.complete();
                })
            );
        } else {
            this.unsubscribe.next(true);
            this.unsubscribe.complete();
            this.deviceInfo.complete();
            this._control.complete();
            return of();
        }
    }

    public set control(controlState: IControlState) {
        this._control.next(controlState);
    }

    private subscribeControl() {
        this._control
            .pipe(
                pairwise(),
                combineLatest(this.timer),
                map(params => {
                    const prevControl = params[0][0];
                    const control = params[0][1];
                    if (control.motorA !== prevControl.motorA || control.motorB !== prevControl.motorB) {
                        let motorA = control.motorA;
                        let motorB = control.motorB;

                        if (motorA > 100) {
                            motorB -= motorA - 100;
                            motorA = 100;
                        }

                        if (motorB > 100) {
                            motorA -= motorB - 100;
                            motorB = 100;
                        }

                        return from(this.hub.motorTimeMultiAsync(50, motorA, motorB));
                    } else {
                        return of();
                    }
                }),
                takeUntil(this.unsubscribe)
            )
            .subscribe(() => {});
    }
}
