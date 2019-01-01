import { Consts } from 'node-poweredup';

export interface IColorAndDistanceEvent {
    port: string;
    detectedColor: Consts.Color;
    distance: number;
}
