import { ITilt } from './ITilt';

export interface IControlState {
    speed: number;
    turnAngle: number;
    tilt?: ITilt;
    motorA?: number;
    motorB?: number;
}
