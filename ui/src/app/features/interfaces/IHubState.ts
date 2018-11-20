import { Colors } from '../consts';
import { ILightPortState } from './ILIghtPortState';
import { IMotorPortState } from './IMotorPortState';

export interface IHubState {
    batteryLevel: number;
    color: Colors;
    distance: number;
    motorPorts: IMotorPortState[];
    lightPorts: ILightPortState[];
}
