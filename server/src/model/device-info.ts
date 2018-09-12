import MovehubAsync = require('movehub-async');

import { IDeviceInfo } from '../interfaces/IDeviceInfo';
import { IPorts } from '../interfaces/IPorts';
import { Ports } from './ports';

export class DeviceInfo implements IDeviceInfo {
    public ports: IPorts;
    public tilt: MovehubAsync.ITilt;
    public distance: number;
    public rssi: number;
    public color: string;
    public error: string;
    public connected: boolean;

    constructor() {
        this.ports = new Ports();
        this.tilt = {
            pitch: 0,
            roll: 0
        };
    }
}
