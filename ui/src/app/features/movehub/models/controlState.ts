import { IControlState } from '../interfaces/IControlState';
import { ITilt } from '../interfaces/ITilt';

export class ControlState implements IControlState {
    constructor(
        public motorA: number = 0,
        public motorB: number = 0
    ) {}
}
