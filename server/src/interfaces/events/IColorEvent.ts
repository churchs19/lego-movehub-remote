import { Consts } from 'node-poweredup';

export interface IColorEvent {
    port: string;
    detectedColor: Consts.Colors;
}
