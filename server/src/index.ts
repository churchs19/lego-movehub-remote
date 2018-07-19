import express from 'express';
import * as http from 'http';

const app: express.Application = express();

app.get('/', (req: any, res: any) => {
    console.log(req.toString());
    res.status(200).json({ status: 'ok' });
});

const httpPort = 3000;
app.set('port', httpPort);
const httpServer = http.createServer(app);

// listen on provided ports
httpServer.listen(httpPort, () => {
    console.log(`Listening on port ${httpPort}`);
});
