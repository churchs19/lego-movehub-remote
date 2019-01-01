import { Consts } from 'node-poweredup';

import { IColorAndDistanceEvent } from '../../interfaces/events/IColorAndDistanceEvent';

export class ColorAndDistanceEvent implements IColorAndDistanceEvent {
    public port: string;
    public detectedColor: Consts.Color;
    public distance: number;

    constructor(args: any[]) {
        this.port = args[0];
        this.detectedColor = args[1];
        this.distance = args[2];
    }
}
