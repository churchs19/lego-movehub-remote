import { Consts } from 'node-poweredup';

import { IButtonEvent } from '../../interfaces/events/IButtonEvent';

export class ButtonEvent implements IButtonEvent {
    public button: string;
    public state: Consts.ButtonStates;

    constructor(args: any[]) {
        this.button = args[0];
        this.state = args[1];
    }
}
