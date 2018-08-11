import { IDeviceInfo } from '../interfaces/IDeviceInfo';
import { IPorts } from '../interfaces/IPorts';

export class DeviceInfo implements IDeviceInfo {
    public ports: IPorts;
    public tilt: MovehubAsync.ITilt;
    public distance: number;
    public rssi: number;
    public color: string;
    public error: string;
    public connected: boolean;
}
