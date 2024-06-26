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

dotenv.config();
const requestLogStream = createStream('request.log', { interval: '1d', path: path.join(__dirname, 'logs') });

const corsOptions = {
    origin: env.CORS
};

const app = express();
// app.use(cors(corsOptions)); To be enabled (Security feature)
app.use(cors({ origin: "*"}));
app.use(compression());
app.use(bodyParser.json());
app.use(morgan('combined', { stream: requestLogStream }));

const port = process.env.PORT ? process.env.PORT : 3000;

app.use('/api', router());

app.listen(port, () => {
    console.log("Server waiting on port:", port);
});

export default app;