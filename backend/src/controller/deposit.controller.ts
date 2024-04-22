import express from 'express';

export const setFees = async (req: express.Request, res: express.Response) => {
    try {
        const body = req.body;
    } catch (error) {
        return res.sendStatus(400);
    }
}

export const getFees = async (req: express.Request, res: express.Response) => {
    
}

export const getDepositFee = async (req: express.Request, res: express.Response) => {
    
}

export const getReversalFee = async (req: express.Request, res: express.Response) => {
    
}

export const getStatistics = async (req: express.Request, res: express.Response) => {
    
}

export const deposit = async (req: express.Request, res: express.Response) => {
    
}
