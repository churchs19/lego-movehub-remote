import { IControlData } from '../interfaces/IControlData';

export class ControlData implements IControlData {
    public speed: number;
    public turnAngle: number;
    public tilt: MovehubAsync.ITilt;
    public updateInputMode: null;
    public motorA?: number;
    public motorB?: number;
}
