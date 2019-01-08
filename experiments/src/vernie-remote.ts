import PoweredUP = require('node-poweredup');

class VernieRemote {
    private poweredUP = new PoweredUP.PoweredUP();
    private poweredUP2 = new PoweredUP.PoweredUP();
    private boostHub: PoweredUP.BoostMoveHub;
    private remote: PoweredUP.PUPRemote;

    public init() {
        this.poweredUP.on('discover', async (hub: PoweredUP.Hub) => {
            if (hub instanceof PoweredUP.BoostMoveHub && !this.boostHub) {
                this.boostHub = hub;
                await this.boostHub.connect();
                console.log(`Connected to ${hub.name} of type ${PoweredUP.Consts.HubType[hub.type]}!`);
            }
            this.poweredUP.stop();
        });
        this.poweredUP.scan();

        console.log(`Waiting for Vernie and remote...`);
    }
}

const app = new VernieRemote().init();
export { app };
