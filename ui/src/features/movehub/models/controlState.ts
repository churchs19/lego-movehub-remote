import { IControlState } from '../interfaces/IControlState';
import { ITilt } from '../interfaces/ITilt';

export class ControlState implements IControlState {
    constructor(
        public speed: number,
        public turnAngle: number,
        public tilt?: ITilt,
        public motorA?: number,
        public motorB?: number
    ) {}
}
