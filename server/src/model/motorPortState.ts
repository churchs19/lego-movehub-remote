import { Consts } from 'node-poweredup';

import { IPortState } from '../interfaces/IPortState';

export class MotorPortState implements IPortState {
    public motorSpeed: number;
    constructor(public portName: string, public deviceType: Consts.Devices) {}
}
