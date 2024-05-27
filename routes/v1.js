import express from "express";
import {
  getClubNews,
} from "../controllers/blogs/blogs.js";

const router = express.Router();


router.post("/getClubNews", getClubNews);


export default router;
