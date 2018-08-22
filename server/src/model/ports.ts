import { IPorts } from '../interfaces/IPorts';
import { IPortStatus } from '../interfaces/IPortStatus';
import { PortStatus } from './port-status';

export class Ports implements IPorts {
    [key: string]: IPortStatus;
    public A: IPortStatus;
    public B: IPortStatus;
    public AB: IPortStatus;
    public C: IPortStatus;
    public D: IPortStatus;
    public LED: IPortStatus;

    constructor() {
        this.A = new PortStatus();
        this.B = new PortStatus();
        this.AB = new PortStatus();
        this.C = new PortStatus();
        this.D = new PortStatus();
        this.LED = new PortStatus();
    }
}
