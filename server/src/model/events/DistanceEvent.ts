import { IDistanceEvent } from '../../interfaces/events/IDistanceEvent';

export class DistanceEvent implements IDistanceEvent {
    public port: string;
    public distance: number;

    constructor(args: any[]) {
        this.port = args[0];
        this.distance = args[1];
    }
}
