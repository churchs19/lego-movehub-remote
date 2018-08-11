// Type definitions for movehub-async(https://github.com/hobbyquaker/node-movehub) version 0.4.1
// Definitions by: Shane Church <https://s-cchurch.net>
import { EventEmitter } from 'events';

export type BoostConnectCallback = (error: null | Error, hub: Hub) => {};

export interface IHubDetails {
    uudi: string;
    address: string;
    localname: string;
}

export class Boost extends EventEmitter {
    constructor();
    afterInitialization(): void;
    connect(address: string, callback: BoostConnectCallback): void;
    connectAsync(hubDetails: IHubDetails): Promise<Hub>;
    bleReadyAsync(): Promise<boolean>;
    hubFoundAsync(): Promise<IHubDetails>;
    getHubAsync(): Promise<Hub>;
}

export class Hub extends EventEmitter {
    constructor(options: any);
    disconnect(): void;
    disconnectAsync(): Promise<boolean>;
    afterInitialization(): void;
    motorTime(port: string | number, seconds: number, dutyCycle: number | Function, callback?: Function): void;
    motorTimeAsync(port: string | number, seconds: number, dutyCycle: number, wait?: boolean): Promise<void>;
    motorTimeMulti(seconds: number, dutyCycleA: number, dutyCycleB: number, callback: Function): void;
    motorTimeMultiAsync(seconds: number, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<void>;
    motorAngle(port: string | number, angle: number, dutyCycle: number | Function, callback?: Function): void;
    motorAngleAsync(port: string | number, angle: number, dutyCycle?: number, wait?: boolean): Promise<void>;
    motorAngleMulti(angle: number, dutyCycleA: number, dutyCycleB: number, callback: Function): void;
    motorAngleMultiAsync(angle: number, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<void>;
    led(color: boolean | number | string, callback: Function): void;
    ledAsync(color: boolean | number | string): Promise<void>;
    useMetricUnits(): void;
    useImperialUnits(): void;
    setFrictionModifier(modifier: number): void;
    drive(distance: number, wait?: boolean): Promise<void>;
    turn(degrees: number, wait?: boolean): Promise<void>;
    subscribe(port: string | number, option: number, callback: Function): void;
    subscribeAll(): void;
    write(data: string | Buffer, callback: Function): void;
}

export as namespace Movehub;
