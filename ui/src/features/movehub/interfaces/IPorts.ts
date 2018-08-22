import { IPortStatus } from './IPortStatus';

export interface IPorts {
    [key: string]: IPortStatus;
    A: IPortStatus;
    B: IPortStatus;
    AB: IPortStatus;
    C: IPortStatus;
    D: IPortStatus;
    LED: IPortStatus;
}
