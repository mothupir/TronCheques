import express from 'express';

import { setFees, getFees, getDepositFee, getReversalFee, getStatistics, deposit, withdraw, depositWithPrivateKey } from '../controller/deposit.controller';

export default (router: express.Router) => {
    router.get('/fees/all', getFees);
    router.get('/fees/deposit', getDepositFee);
    router.get('/fees/reversal', getReversalFee);
    router.get('/statistic', getStatistics);
    
    router.post('/fees', setFees);
    router.post('/deposit/key', depositWithPrivateKey);
    router.post('/deposit', deposit);
    router.post('/withdraw', withdraw);
}