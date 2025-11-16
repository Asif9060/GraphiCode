const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// @route   GET /api/blog
// @desc    Get all blog posts (public - only published)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const { category, featured, limit } = req.query;
      let query = { published: true };

      if (category) {
         query.category = category;
      }
      if (featured === "true") {
         query.featured = true;
      }

      let blogQuery = Blog.find(query).sort({ publishDate: -1 });

      if (limit) {
         blogQuery = blogQuery.limit(parseInt(limit));
      }

      const blogs = await blogQuery;

      res.json({
         success: true,
         count: blogs.length,
         data: blogs,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get("/:slug", async (req, res) => {
   try {
      const blog = await Blog.findOne({ slug: req.params.slug, published: true });

      if (!blog) {
         return res.status(404).json({
            success: false,
            message: "Blog post not found",
         });
      }

      // Increment views
      blog.views += 1;
      await blog.save();

      res.json({
         success: true,
         data: blog,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   POST /api/blog
// @desc    Create blog post
// @access  Private
router.post("/", protect, upload.single("featuredImage"), async (req, res) => {
   try {
      const blogData = {
         ...req.body,
         tags: req.body.tags
            ? Array.isArray(req.body.tags)
               ? req.body.tags
               : JSON.parse(req.body.tags)
            : [],
      };

      if (req.file) {
         blogData.featuredImage = `/uploads/${req.file.filename}`;
      }

      const blog = await Blog.create(blogData);

      res.status(201).json({
         success: true,
         data: blog,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post
// @access  Private
router.put("/:id", protect, upload.single("featuredImage"), async (req, res) => {
   try {
      let blog = await Blog.findById(req.params.id);

      if (!blog) {
         return res.status(404).json({
            success: false,
            message: "Blog post not found",
         });
      }

      const updateData = { ...req.body };
      if (req.body.tags && typeof req.body.tags === "string") {
         updateData.tags = JSON.parse(req.body.tags);
      }

      if (req.file) {
         updateData.featuredImage = `/uploads/${req.file.filename}`;
      }

      blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
         new: true,
         runValidators: true,
      });

      res.json({
         success: true,
         data: blog,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
// @access  Private
router.delete("/:id", protect, async (req, res) => {
   try {
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
         return res.status(404).json({
            success: false,
            message: "Blog post not found",
         });
      }

      await blog.deleteOne();

      res.json({
         success: true,
         message: "Blog post deleted successfully",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

module.exports = router;
