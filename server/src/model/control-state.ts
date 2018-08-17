import { IControlState } from '../interfaces/IControlState';

export class ControlState implements IControlState {
    public speed: number;
    public turnAngle: number;
    public tilt: MovehubAsync.ITilt;
    public motorA?: number;
    public motorB?: number;
}
