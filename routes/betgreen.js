import express from "express";
import { getAllMarkets, getLeagues } from "../controllers/betgreen/index.js";


const router = express.Router();

router.get("/sp/markets", getAllMarkets)
router.get("/sp/leagues", getLeagues)

export default router;
