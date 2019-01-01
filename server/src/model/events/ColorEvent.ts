import { Consts } from 'node-poweredup';

import { IColorEvent } from '../../interfaces/events/IColorEvent';

export class ColorEvent implements IColorEvent {
    public port: string;
    public detectedColor: Consts.Color;

    constructor(args: any[]) {
        this.port = args[0];
        this.detectedColor = args[1];
    }
}
