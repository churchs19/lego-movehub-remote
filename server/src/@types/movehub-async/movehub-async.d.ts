import { EventEmitter } from 'events';

// Type definitions for movehub-async(https://github.com/hobbyquaker/node-movehub) version 0.4.1
// Definitions by: Shane Church <https://s-cchurch.net>
declare namespace MovehubAsync {
    export type BoostConnectCallback = (error: null | Error, hub: Hub) => {};

    export interface IHubDetails {
        uudi: string;
        address: string;
        localname: string;
    }

    export interface IPortAction {
        port: PortName;
        action: string;
    }

    export interface IPortRotation {
        port: PortName,
        angle: number;
    }

    export interface ITilt {
        roll: number;
        pitch: number;
    }

    export enum LedColor {
        off = 'off',
        pink = 'pink',
        purple = 'purple',
        blue = 'blue',
        lightblue = 'lightblue',
        cyan = 'cyan',
        green = 'green',
        yellow = 'yellow',
        orange = 'orange',
        red = 'red',
        white = 'white'
    }

    export enum PortName {
        A = 'A',
        B = 'B',
        AB = 'AB',
        C = 'C',
        D = 'D'
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
        motorTimeMulti(seconds: number, dutyCycleA: number, dutyCycleB: number, callback?: Function): void;
        motorTimeMultiAsync(seconds: number, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<void>;
        motorAngle(port: string | number, angle: number, dutyCycle: number | Function, callback?: Function): void;
        motorAngleAsync(port: string | number, angle: number, dutyCycle?: number, wait?: boolean): Promise<void>;
        motorAngleMulti(angle: number, dutyCycleA: number, dutyCycleB: number, callback?: Function): void;
        motorAngleMultiAsync(angle: number, dutyCycleA?: number, dutyCycleB?: number, wait?: boolean): Promise<void>;
        led(color: LedColor | boolean | number | string, callback: Function): void;
        ledAsync(color: LedColor | boolean | number | string): Promise<void>;
        useMetricUnits(): void;
        useImperialUnits(): void;
        setFrictionModifier(modifier: number): void;
        drive(distance: number, wait?: boolean): Promise<void>;
        turn(degrees: number, wait?: boolean): Promise<void>;
        subscribe(port: string | number, option: number, callback: Function): void;
        subscribeAll(): void;
        write(data: string | Buffer, callback: Function): void;
    }
}

export = MovehubAsync;
export as namespace MovehubAsync;
