import express from "express";
import { isAuthenticated } from "../controllers/auth/authentication.js"; 
import {
  addBlog,
  deleteBlog,
  getSingleBlog,
  getAllBlogs,
  updateBlog,
} from "../controllers/blogs/blogs.js";

const router = express.Router();

router.post("/create", isAuthenticated, addBlog);
router.get("/all", getAllBlogs);
router.get("/single/:id", getSingleBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
