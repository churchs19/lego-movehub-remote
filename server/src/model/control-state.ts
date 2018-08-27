import { IControlState } from '../interfaces/IControlState';

export class ControlState implements IControlState {
    public speed: number;
    public turnAngle: number;
    public tilt?: MovehubAsync.ITilt;
    public motorA?: number;
    public motorB?: number;

    constructor() {
        this.speed = 0;
        this.turnAngle = 0;
        // this.tilt = {
        //     pitch: 0,
        //     roll: 0
        // };
    }
}
