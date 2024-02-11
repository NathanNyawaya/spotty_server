import express from "express";
import { fetchEplStandings } from "../services/stats/stats.js";


const router = express.Router();

router.get("/epl", fetchEplStandings)


export default router;
