import { IControlData } from '../interfaces/IControlData';

export class ControlData implements IControlData {
    public input: null;
    public speed: number;
    public turnAngle: number;
    public tilt: MovehubAsync.ITilt;
    public forceState: null;
    public updateInputMode: null;
}
