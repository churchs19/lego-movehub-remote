import { IRotationEvent } from '../../interfaces/events/IRotationEvent';

export class RotationEvent implements IRotationEvent {
    public port: string;
    public rotation: number;

    constructor(args: any[]) {
        this.port = args[0];
        this.rotation = args[1];
    }
}
