import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import dotenv from 'dotenv';
import router from './router';
import { env } from 'process';

import { setFees, getFees, getDepositFee, getReversalFee, getStatistics, deposit, withdraw, depositWithPrivateKey, password } from './controller/deposit.controller';

dotenv.config();
const requestLogStream = createStream('request.log', { interval: '1d', path: path.join(__dirname, 'logs') });

const corsOptions = {
    origin: 'https://tron-cheques.vercel.app'
};

const app = express();
// app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(morgan('combined', { stream: requestLogStream }));

const port = process.env.PORT ? process.env.PORT : 3000;

// app.use('/api', router());

app.get('/api/fees/all', getFees);
app.get('/api/fees/deposit', getDepositFee);
app.get('/api/fees/reversal', getReversalFee);
app.get('/api/statistic', getStatistics);

app.post('/api/fees', setFees);
app.post('/api/deposit/key', depositWithPrivateKey);
app.post('/api/deposit', cors(corsOptions), deposit);
app.post('/api/password', password)
app.post('/api/withdraw', cors(corsOptions), withdraw);

app.listen(port, () => {
    console.log("Server waiting on port:", port);
});

export default app;