export interface IMotorAngleRequest {
    hubName: string;
    port: string;
    angle: number;
    speed?: number;
}
