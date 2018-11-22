import { Colors } from '../consts';
import { ILightPortStateCollection } from './ILightPortStateCollection';
import { IMotorPortStateCollection } from './IMotorPortStateCollection';

export interface IHubState {
    connected: boolean;
    name: string;
    batteryLevel: number;
    ledColor: Colors;
    color: Colors;
    distance: number;
    motorPorts: IMotorPortStateCollection;
    lightPorts: ILightPortStateCollection;
}
