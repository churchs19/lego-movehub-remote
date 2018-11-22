import { Consts } from 'node-poweredup';

export interface IColorAndDistanceEvent {
    port: string;
    detectedColor: Consts.Colors;
    distance: number;
}
