import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blog from "../../models/blogs/Blog.js";

dotenv.config();

// add property
export const addBlog = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, author, summaryText, paragraphs, club, imageFiles } =
      req.body.blogData;
    // console.log(title, author, summaryText, paragraphs, club)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const newBlogDoc = new Blog({
      title,
      club,
      summaryText,
      imageFiles,
      paragraphs,
      views: 0,
      user_id: decoded.id,
      author,
    });
    console.log(newBlogDoc);
    await newBlogDoc.save();
    console.log("saved");
    res.status(200).json({ message: "Blog uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "here again", err: err });
  }
};

// get all properties
export const getAllBlogs = async (req, res) => {
  try {
    console.log("fetching all blogs ...");
    const all_blogs = await Blog.find().sort({ createdAt: -1 });
    if (all_blogs.length > 0) {
      const blog_fetch_response =
        all_blogs.length > 0 ? all_blogs : "Empty blogs";
      res.status(200).json(blog_fetch_response);
      console.log(`fetching ${all_blogs.length} blogs status ok`);
    }
  } catch (err) {
    console.log("fetching all blogs status failed");
    res.status(500).json(err);
  }
};

// get landlord  listings
export const getUserBlogs = async (req, res) => {
  // console.log("landlord endpoint hit");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_id = jwt.verify(token, process.env.JWT_SECRET_KEY).id;
    const blogs = await Blog.find({ user_id: user_id }).sort({
      createdAt: -1,
    });
    const blog_fetch_response = blogs || "Author has zero blogs";
    res.json(blog_fetch_response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;
    const blog_doc = await Blog.findById(blog_id);
    if (blog_doc) {
      console.log(`blog with id ${blog_id} fetched`);
      res.status(200).json({ message: "Blog Document Found", blog_doc });
    } else {
      res.status(404).json({ message: "No Blog Document Found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// update property
export const updateBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;

    const updatedBlogData = req.body.blogData;
    const updatedBlog = await Blog.findByIdAndUpdate(blog_id, updatedBlogData, {
      new: true,
    });

    if (updatedBlog) {
      res.status(200).json({ message: "Blog updated" });
    } else {
      res.status(403).json("no blog found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete property
export const deleteBlog = async (req, res) => {
  try {
    const blog_to_delete = await Blog.findById(req.params.id);
    if (blog_to_delete.user_id === req.body.userId) {
      await blog_to_delete.deleteOne();
      res.status(200).json("the blog_to_delete has been deleted");
    } else {
      res.status(403).json("you can delete only your blog_to_delete");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
