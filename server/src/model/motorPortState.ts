import { Consts } from 'node-poweredup';

export class MotorPortState {
    constructor(public portName: string, public deviceType: Consts.Devices) {}
}
