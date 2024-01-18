import express from "express";
import { getAllMarkets, getLeagues, getLeaguesEvents } from "../controllers/betgreen/index.js";


const router = express.Router();

router.get("/sp/markets", getAllMarkets)
router.get("/sp/leagues", getLeagues)
router.get("/sp/leagueEvents", getLeaguesEvents)

export default router;
