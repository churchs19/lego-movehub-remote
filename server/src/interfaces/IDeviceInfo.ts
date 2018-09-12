import MovehubAsync = require('movehub-async');

import { IPorts } from './IPorts';

export interface IDeviceInfo {
    ports: IPorts;
    tilt: MovehubAsync.ITilt;
    distance: number;
    rssi: number;
    color: string;
    error: string;
    connected: boolean;
}
