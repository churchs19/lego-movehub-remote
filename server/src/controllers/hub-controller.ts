import * as boost from 'movehub-async';
import { BehaviorSubject, from, fromEvent, interval, Observable, of, Subject, timer } from 'rxjs';
import { combineLatest, debounceTime, map, take, takeUntil } from 'rxjs/operators';

import { IControlState } from '../interfaces/IControlState';
import { IDeviceInfo } from '../interfaces/IDeviceInfo';

export class HubController {
    public deviceInfo: BehaviorSubject<IDeviceInfo>;

    private hub: MovehubAsync.Hub;
    private device: IDeviceInfo;
    private timer: Observable<number>;
    private _control: BehaviorSubject<IControlState>;
    private unsubscribe: Subject<boolean>;

    constructor(deviceInfo: IDeviceInfo, controlState: IControlState) {
        this.hub = null;
        this.unsubscribe = new Subject<boolean>();
        this.deviceInfo = new BehaviorSubject(deviceInfo);
        this.device = deviceInfo;
        this._control = new BehaviorSubject<IControlState>(controlState);
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
        this.timer = interval(50);
        let moving = false;
        this._control
            .pipe(
                debounceTime(50),
                combineLatest(this.timer),
                takeUntil(this.unsubscribe)
            )
            .subscribe(params => {
                if (!moving) {
                    let motorA = params[0].motorA > 100 ? 100 : params[0].motorA;
                    motorA = motorA < -100 ? -100 : motorA;
                    let motorB = params[0].motorB > 100 ? 100 : params[0].motorB;
                    motorB = motorB < -100 ? -100 : motorB;

                    moving = true;

                    from(this.hub.motorTimeMultiAsync(0.1, motorA, motorB)).subscribe(() => {
                        moving = false;
                    });
                }
            });
    }
}
