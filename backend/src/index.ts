import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import dotenv from 'dotenv';
import router from './router';

import { setFees, getFees, getDepositFee, getReversalFee, getStatistics, deposit, withdraw, depositWithPrivateKey, password } from './controller/deposit.controller';
import { env } from 'process';

dotenv.config();
const requestLogStream = createStream('request.log', { interval: '1d', path: path.join(__dirname, 'logs') });

const corsOptions = {
    origin: env.CORS,
    optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(morgan('combined', { stream: requestLogStream }));

const port = process.env.PORT ? process.env.PORT : 3000;

//app.use('/api', router());

app.get('/fees/all', getFees);
app.get('/fees/deposit', getDepositFee);
app.get('/fees/reversal', getReversalFee);
app.get('/statistic', getStatistics);

app.post('/fees', setFees);
app.post('/deposit/key', depositWithPrivateKey);
app.post('/deposit', deposit);
app.post('/password', password)
app.post('/withdraw', withdraw);

module.exports = app;

app.listen(port, () => {
    console.log("Server waiting on port:", port);
});