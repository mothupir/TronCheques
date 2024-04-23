import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { createStream } from 'rotating-file-stream';

import router from './router';

dotenv.config();

const app = express();

app.use(cors());

app.use(compression());
app.use(bodyParser.json());

const requestLogStream = createStream('request.log', { interval: '1d', path: path.join(__dirname, 'logs') });
app.use(morgan('combined', { stream: requestLogStream }));

app.use('/api', router());

const server = http.createServer(app);

const port = process.env.PORT ? process.env.PORT : 3000;

server.listen(port, () => {
    console.log("Server waiting on port:", port);
});