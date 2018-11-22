import { Consts } from 'node-poweredup';

import { IAttachEvent } from '../../interfaces/events/IAttachEvent';

export class AttachEvent implements IAttachEvent {
    public port: string;
    public type: Consts.Devices;

    constructor(args: any[]) {
        this.port = args[0];
        this.type = args[1];
    }
}
