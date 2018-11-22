import { IDetachEvent } from '../../interfaces/events/IDetachEvent';

export class DetatchEvent implements IDetachEvent {
    public port: string;

    constructor(args: any[]) {
        this.port = args[0];
    }
}
