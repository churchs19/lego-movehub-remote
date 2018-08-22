import { IPorts } from './IPorts';
import { ITilt } from './ITilt';

export interface IDeviceInfo {
    ports: IPorts;
    tilt: ITilt;
    distance: number;
    rssi: number;
    color: string;
    error: string;
    connected: boolean;
}
