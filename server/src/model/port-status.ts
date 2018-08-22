import { IPortStatus } from '../interfaces/IPortStatus';

export class PortStatus implements IPortStatus {
    public action: string;
    public angle: number;

    constructor(action: string = '', angle: number = 0) {
        this.action = action;
        this.angle = angle;
    }
}
