import express from "express";
import { getAllPredictions } from "../controllers/predictions/predictionsController.js";


const router = express.Router();

router.get("/", getAllPredictions);
// router.post("/tips", getEplPredictions);
// router.get("/laliga", getLaligaPredictions);
// router.get("/bundesliga", getBundesligaPredictions);

export default router;
