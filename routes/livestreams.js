import express from "express";
import {
  getAllLiveStreamsLinks,
  getStreamLinks,
} from "../controllers/livestreams/livestreamController.js";

const router = express.Router();

router.get("/", getAllLiveStreamsLinks);
router.get("/:id", getStreamLinks);

export default router;
