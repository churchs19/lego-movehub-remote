import * as boost from 'movehub-async';
import { from, fromEvent, Observable, ReplaySubject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { LedColor } from './ledColor';

export class MovehubService {
    public bleReady: Observable<boolean>;
    public hubFound: Observable<Movehub.IHubDetails>;
    public disconnected: Observable<void>;
    public hub: ReplaySubject<Movehub.Hub>;

    private boost: Movehub.Boost = boost;

    constructor() {
        this.hub = new ReplaySubject<Movehub.Hub>(1);
        this.bleReady = fromEvent<boolean>(boost, 'ble-ready');
        this.hubFound = fromEvent<Movehub.IHubDetails>(this.boost, 'hub-found');
        this.disconnected = fromEvent<void>(boost, 'disconnect');
    }

    public init() {
        this.getHub().subscribe(hub => {
            this.hub.next(hub);
        });
    }

    public connect(details: Movehub.IHubDetails): Observable<Movehub.Hub> {
        return from(this.boost.connectAsync(details));
    }

    public getHub(): Observable<Movehub.Hub> {
        return from(this.boost.getHubAsync());
    }

    public led(color: LedColor): Observable<void> {
        return this.hub.pipe(
            take(1),
            mergeMap(it => {
                return from(it.ledAsync(color));
            })
        );
    }
}
