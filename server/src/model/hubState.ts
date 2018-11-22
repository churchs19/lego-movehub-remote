import { Consts } from 'node-poweredup';

import { LightPortStateCollection } from './lightPortStateCollection';
import { MotorPortStateCollection } from './motorPortStateCollection';

export class HubState {
    public connected: boolean = false;
    public batteryLevel: number;
    public ledColor: Consts.Colors;
    public color: Consts.Colors;
    public distance: number;
    public motorPorts: MotorPortStateCollection;
    public lightPorts: LightPortStateCollection;

    constructor(public name: string) {
        this.motorPorts = new MotorPortStateCollection();
        this.lightPorts = new LightPortStateCollection();
    }
}
