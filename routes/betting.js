import express from "express";
import { addTip, deleteTip, editTip, getAllTips, getTipOffer } from "../controllers/predictions/predictionsController.js";


const router = express.Router();

router.post("/tips/add_tip", addTip);
router.get("/tips/all_tips", getAllTips)
router.get("/tips/:id", getTipOffer);
router.delete("/tips/delete/:id", deleteTip);
router.put("/tips/update/:id", editTip);


export default router;
