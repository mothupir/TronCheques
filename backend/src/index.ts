import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';

import { withdraw } from './services/withdraw.service';
import { deposit } from './services/deposit.service';

dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT ? process.env.PORT : 3000;

server.listen(8080, () => {
    withdraw(1,"TTXenuNeifsLn7PcsQWHgAafWZvfxcx1Bi", "Code");
    console.log("Server waiting on port:", port);
});