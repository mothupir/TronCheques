import express from 'express';

import { 
    setFees as setFeesService,
    getFees as getFeesService, 
    getDepositFee as getDepositFeeService, 
    getReversalFee as getReversalFeeService,
    getStatistics as getStatisticsService,
    deposit as depositService,
    withdraw as withdrawService,
    depositWithPrivateKey as depositWithPrivateKeyService,
    password as passwordService
} from '../service/deposit.service';

export const setFees = async (req: express.Request, res: express.Response) => {
    try {
        await setFeesService(req.body);
        return res.status(200).json(true).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
};

export const getFees = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getFeesService();
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
};

export const getDepositFee = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getDepositFeeService(req.body.amount);
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
};

export const getReversalFee = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getReversalFeeService(req.body.amount);
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
};

export const getStatistics = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getStatisticsService();
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(400).json(error.message).end();
    }
};

export const deposit = async (req: express.Request, res: express.Response) => {
    try {
        const output = depositService(req.body.password);
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
};

export const password = async (req: express.Request, res: express.Response) => {
    try {
        const output = passwordService(req.body.password);
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
};

export const depositWithPrivateKey = async (req: express.Request, res: express.Response) => {
    try {
        const output = await depositWithPrivateKeyService(req.body.code, req.body.password, req.body.amount, req.body.ref, req.body.key);
        return res.status(200).json(output).end();
    } catch (error) {
        return res.status(500).json(error.message).end();
    }
}

export const withdraw = async (req: express.Request, res: express.Response) => {
    try {
        const output = await withdrawService(req.body.uuid, req.body.password, req.body.address);
        return res.status(200).json(output).end();
    } catch (error) {
        res.status(500).json(error.message).end();
    }
};