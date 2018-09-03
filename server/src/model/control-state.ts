import { IControlState } from '../interfaces/IControlState';

export class ControlState implements IControlState {
    constructor(public motorA: number, public motorB: number) {}
}
