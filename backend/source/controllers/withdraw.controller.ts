import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";

const withdraw = async (req: Request, res: Response, next: NextFunction) => {
    return res.send("Withdrawn");
};

export {
    withdraw
}