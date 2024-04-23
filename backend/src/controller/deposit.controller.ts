import express from 'express';

import { 
    setFees as setFeesService,
    getFees as getFeesService, 
    getDepositFee as getDepositFeeService, 
    getReversalFee as getReversalFeeService,
    getStatistics as getStatisticsService,
    deposit as depositService,
    withdraw as withdrawService
} from '../service/deposit.service';

export const setFees = async (req: express.Request, res: express.Response) => {
    try {
        await setFeesService(req.body);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(403).json({ error: error.message }).end();
    }
};

export const getFees = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getFeesService();
        return res.status(200).json({ data: output }).end();
    } catch (error) {
        return res.status(500).json({ error: error.message }).end();
    }
};

export const getDepositFee = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getDepositFeeService(req.body.amount);
        return res.status(200).json({ data: output }).end();
    } catch (error) {
        return res.status(500).json({ error: error.message }).end();
    }
};

export const getReversalFee = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getReversalFeeService(req.body.amount);
        return res.status(200).json({ data: output }).end();
    } catch (error) {
        return res.status(500).json({ error: error.message }).end();
    }
};

export const getStatistics = async (req: express.Request, res: express.Response) => {
    try {
        const output = await getStatisticsService();
        return res.status(200).json({ data: output }).end();
    } catch (error) {
        return res.status(500).json({ error: error.message }).end();
    }
};

export const deposit = async (req: express.Request, res: express.Response) => {
    try {
        const output = depositService(req.body.code);
        return res.status(200).json({ data: output }).end();
    } catch (error) {
        return res.status(500).json({ error: error.message }).end();
    }
};

export const withdraw = async (req: express.Request, res: express.Response) => {
    try {
        const output = await withdrawService(req.body.index, req.body.address, req.body.password);
        return res.status(200).json({ data: output }).end();
    } catch (error) {
        res.status(400).json({ error: error.message }).end();
    }
};