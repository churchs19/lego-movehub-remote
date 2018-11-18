import { Consts } from 'node-poweredup';

import { LightPortState } from './lightPortState';
import { MotorPortState } from './motorPortState';

export class HubState {
    public batteryLevel: number;
    public current: number;
    public color: Consts.Colors;
    public distance: number;
    public motorPorts: MotorPortState[];
    public lightPorts: LightPortState[];

    constructor(public name: string) {
        this.motorPorts = [];
    }
}