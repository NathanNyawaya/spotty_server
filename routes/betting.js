import express from "express";
import { addTip, getAllTips } from "../controllers/predictions/predictionsController.js";


const router = express.Router();

router.post("/tips/add_tip", addTip);
router.get("/tips/all_tips", getAllTips)


export default router;
