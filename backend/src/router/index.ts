import express from 'express';
import deposit from './deposit.router'

const router = express.Router();

export default (): express.Router => {
    deposit(router);

    return router;
};