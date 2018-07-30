import { Boost } from 'movehub-async';

export class MovehubService {
    constructor() {
        const boost = new Boost();
        boost.bleReadyAsync().then((ready: boolean) => {
            console.log(ready.toString());
        });
    }
}
