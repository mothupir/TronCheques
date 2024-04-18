import express from "express";
import withdraw from "./withdraw.route";

const router = express.Router();

router.use('/api', withdraw);

export default router;