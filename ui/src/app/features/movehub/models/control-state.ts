import { IControlState } from '../interfaces/IControlState';

export class ControlState implements IControlState {
    constructor(public motorA: number = 0, public motorB: number = 0) {}
}
