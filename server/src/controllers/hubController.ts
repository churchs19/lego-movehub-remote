import { BoostMoveHub, Consts, DuploTrainBase, Hub, PUPHub, WeDo2SmartHub } from 'node-poweredup';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { IAttachEvent } from '../interfaces/events/IAttachEvent';
import { IButtonEvent } from '../interfaces/events/IButtonEvent';
import { IColorAndDistanceEvent } from '../interfaces/events/IColorAndDistanceEvent';
import { IColorEvent } from '../interfaces/events/IColorEvent';
import { IDetachEvent } from '../interfaces/events/IDetachEvent';
import { IDistanceEvent } from '../interfaces/events/IDistanceEvent';
import { IRotationEvent } from '../interfaces/events/IRotationEvent';
import { ITiltEvent } from '../interfaces/events/ITiltEvent';
import { ILedRequest } from '../interfaces/ILedRequest';
import { IMotorAngleRequest } from '../interfaces/IMotorAngleRequest';
import { IMotorSpeedRequest } from '../interfaces/IMotorSpeedRequest';
import { AttachEvent } from '../model/events/AttachEvent';
import { ButtonEvent } from '../model/events/ButtonEvent';
import { ColorAndDistanceEvent } from '../model/events/ColorAndDistanceEvent';
import { ColorEvent } from '../model/events/ColorEvent';
import { DetatchEvent } from '../model/events/DetachEvent';
import { DistanceEvent } from '../model/events/DistanceEvent';
import { RotationEvent } from '../model/events/RotationEvent';
import { TiltEvent } from '../model/events/TiltEvent';
import { HubState } from '../model/hubState';
import { LightPortState } from '../model/lightPortState';
import { MotorPortState } from '../model/motorPortState';

export class HubController {
    public hubState: BehaviorSubject<HubState>;
    private disconnectNotifier: Subject<any> = new Subject<any>();
    private _hubState: HubState;

    constructor(private hub: Hub) {
        this._hubState = new HubState(hub.name);
        this.hubState = new BehaviorSubject(this._hubState);
    }

    public init() {
        fromEvent<IButtonEvent>(this.hub, 'button', (...args: any[]) => new ButtonEvent(args))
            .pipe(takeUntil(this.disconnectNotifier))
            .subscribe(eventData => {
                console.log(
                    `${this.hub.name} button ${eventData.button} state ${Consts.ButtonStates[eventData.state]}`
                );
                this.updateHubState();
            });

        fromEvent<IDistanceEvent>(this.hub, 'distance', (...args: any[]) => new DistanceEvent(args))
            .pipe(
                debounceTime(250),
                takeUntil(this.disconnectNotifier)
            )
            .subscribe(eventData => {
                console.log(`${this.hub.name} detected distance of ${eventData.distance} mm on port ${eventData.port}`);
                this.updateHubState();
            });

        fromEvent<IColorEvent>(this.hub, 'color', (...args: any[]) => new ColorEvent(args))
            .pipe(debounceTime(250))
            .subscribe(eventData => {
                console.log(
                    `${this.hub.name} detected color of ${Consts.Colors[eventData.detectedColor]} on port ${
                        eventData.port
                    }`
                );
                this._hubState.color = eventData.detectedColor;
                this.updateHubState();
            });

        fromEvent<IColorAndDistanceEvent>(
            this.hub, 'colorAndDistance',
            (...args: any[]) => new ColorAndDistanceEvent(args)
        )
        .pipe(debounceTime(250))
        .subscribe(eventData => {
            const message = `${this.hub.name} detected color of ${Consts.Colors[eventData.detectedColor]} ` +
            `and distance of ${eventData.distance} mm on port ${eventData.port}`;
            console.log(message);
            this._hubState.color = eventData.detectedColor;
            this._hubState.distance = eventData.distance;
            this.updateHubState();
        });

        fromEvent<ITiltEvent>(this.hub, 'tilt', (...args: any[]) => new TiltEvent(args))
            .pipe(debounceTime(250))
            .subscribe(eventData => {
                console.log(
                    `${this.hub.name} detected tilt of (${eventData.x},${eventData.y}) on port ${eventData.port}`
                );
                this.updateHubState();
            });

        fromEvent<IRotationEvent>(this.hub, 'rotate', (...args: any[]) => new RotationEvent(args))
            .pipe(
                debounceTime(250),
                takeUntil(this.disconnectNotifier)
            )
            .subscribe(eventData => {
                console.log(`${this.hub.name} detected rotation of ${eventData.rotation} on port ${eventData.port}`);
                this.updateHubState();
            });

        fromEvent<IAttachEvent>(this.hub, 'attach', (...args: any[]) => new AttachEvent(args))
            .pipe(takeUntil(this.disconnectNotifier))
            .subscribe(eventData => {
                console.log(`${this.hub.name} connected ${Consts.Devices[eventData.type]} on port ${eventData.port}`);
                switch (eventData.type) {
                    case Consts.Devices.BASIC_MOTOR:
                    case Consts.Devices.BOOST_MOVE_HUB_MOTOR:
                    case Consts.Devices.BOOST_TACHO_MOTOR:
                    case Consts.Devices.DUPLO_TRAIN_BASE_MOTOR:
                    case Consts.Devices.TRAIN_MOTOR:
                        this._hubState.motorPorts[eventData.port] = new MotorPortState(eventData.port, eventData.type);
                    case Consts.Devices.LED_LIGHTS:
                        this._hubState.lightPorts[eventData.port] = new LightPortState(eventData.port, eventData.type);
                }
                this.updateHubState();
            });

        fromEvent<IDetachEvent>(this.hub, 'detach', (...args: any[]) => new DetatchEvent(args))
            .pipe(takeUntil(this.disconnectNotifier))
            .subscribe(eventData => {
                console.log(`${this.hub.name} disconnected device on port ${eventData.port}`);
                if (this._hubState.motorPorts[eventData.port]) {
                    delete this._hubState.motorPorts[eventData.port];
                } else if (this._hubState.lightPorts[eventData.port]) {
                    delete this._hubState.lightPorts[eventData.port];
                }
                this.updateHubState();
            });

        this.hub.on('disconnect', () => {
            console.log(`this.hub ${this.hub.name} disconnected`);
            this.updateHubState(false);
            this.disconnectNotifier.next(false);
        });

        this.updateHubState(true);
    }

    public setMotorSpeed(request: IMotorSpeedRequest) {
        if (this._hubState.motorPorts[request.port]) {
            if (this.hub instanceof BoostMoveHub) {
                (this.hub as BoostMoveHub).setMotorSpeed(request.port, request.speed);
                this._hubState.motorPorts[request.port].motorSpeed = request.speed;
                this.updateHubState();
            } else if (this.hub instanceof DuploTrainBase) {
                (this.hub as DuploTrainBase).setMotorSpeed(request.port, request.speed);
                this._hubState.motorPorts[request.port].motorSpeed = request.speed;
                this.updateHubState();
            } else if (this.hub instanceof PUPHub) {
                (this.hub as PUPHub).setMotorSpeed(request.port, request.speed);
                this._hubState.motorPorts[request.port].motorSpeed = request.speed;
                this.updateHubState();
            } else if (this.hub instanceof WeDo2SmartHub) {
                (this.hub as WeDo2SmartHub).setMotorSpeed(request.port, request.speed);
                this._hubState.motorPorts[request.port].motorSpeed = request.speed;
                this.updateHubState();
            }
        }
    }

    public setMotorAngle(request: IMotorAngleRequest) {
        if (this._hubState.motorPorts[request.port]) {
            if (this.hub instanceof BoostMoveHub) {
                (this.hub as BoostMoveHub).setMotorAngle(request.port, request.angle);
                this.updateHubState();
            }
        }
    }

    public setLed(request: ILedRequest) {
        if (this.hub instanceof BoostMoveHub) {
            (this.hub as BoostMoveHub).setLEDColor(request.color);
        } else if (this.hub instanceof DuploTrainBase) {
            (this.hub as DuploTrainBase).setLEDColor(request.color);
        } else if (this.hub instanceof PUPHub) {
            (this.hub as PUPHub).setLEDColor(request.color);
        } else if (this.hub instanceof WeDo2SmartHub) {
            (this.hub as WeDo2SmartHub).setLEDColor(request.color);
        }
    }

    private updateHubState(connected: boolean = true) {
        this._hubState.connected = connected;
        this._hubState.batteryLevel = this.hub.batteryLevel;
        this.hubState.next(this._hubState);
    }
}
