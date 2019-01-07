import PoweredUP = require('node-poweredup');

class VernieRemote {
    private poweredUP = new PoweredUP.PoweredUP();

    public init() {
        this.poweredUP.on('discover', async (hub: PoweredUP.Hub) => {
            let boostHub: PoweredUP.BoostMoveHub;
            let remote: PoweredUP.PUPRemote;

            if (hub instanceof PoweredUP.BoostMoveHub) {
                await hub.connect();
                boostHub = hub;
            }

            if (hub instanceof PoweredUP.PUPRemote) {
                await hub.connect();
                remote = hub;
            }

            console.log(`Connected to ${hub.name} of type ${PoweredUP.Consts.HubType[hub.type]}!`);
        });
        this.poweredUP.scan();

        console.log(`Waiting for Vernie and remote...`);
    }
}

const app = new VernieRemote().init();
export { app };
