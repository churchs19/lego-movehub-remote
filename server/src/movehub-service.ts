import * as boost from 'movehub-async';
import { from, fromEvent, Observable } from 'rxjs';

export class MovehubService {
    public BleReady: Observable<boolean>;
    public HubFound: Observable<Movehub.IHubDetails>;

    private boost: Movehub.Boost = boost;

    constructor() {
        this.BleReady = fromEvent<boolean>(boost, 'ble-ready');
        this.HubFound = fromEvent<Movehub.IHubDetails>(this.boost, 'hub-found');
    }

    public connect(details: Movehub.IHubDetails): Observable<Movehub.Hub> {
        return from(this.boost.connectAsync(details));
    }

    public getHub(): Observable<Movehub.Hub> {
        return from(this.boost.getHubAsync());
    }
}
