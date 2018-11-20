import { Consts } from 'node-poweredup';

import { IPortState } from '../interfaces/IPortState';

export class LightPortState implements IPortState {
    public brightness: number;
    constructor(public portName: string, public deviceType: Consts.Devices) {}
}
