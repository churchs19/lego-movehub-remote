import { ITiltEvent } from '../../interfaces/events/ITiltEvent';

export class TiltEvent implements ITiltEvent {
    public port: string;
    public x: number;
    public y: number;

    constructor(args: any[]) {
        this.port = args[0];
        this.x = args[1];
        this.y = args[2];
    }
}
