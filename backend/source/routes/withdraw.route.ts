import express from "express";
import { withdraw } from "../controllers/withdraw.controller";

const router = express.Router();

router.use('/withdraw', withdraw);

export default router;