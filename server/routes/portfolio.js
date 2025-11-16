const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// @route   GET /api/portfolio
// @desc    Get all portfolio items (public)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const { category, featured } = req.query;
      let query = { isActive: true };

      if (category && category !== "all") {
         query.category = category;
      }
      if (featured === "true") {
         query.featured = true;
      }

      const portfolioItems = await Portfolio.find(query).sort({
         order: 1,
         createdAt: -1,
      });

      res.json({
         success: true,
         count: portfolioItems.length,
         data: portfolioItems,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   GET /api/portfolio/:id
// @desc    Get single portfolio item
// @access  Public
router.get("/:id", async (req, res) => {
   try {
      const portfolio = await Portfolio.findById(req.params.id);

      if (!portfolio) {
         return res.status(404).json({
            success: false,
            message: "Portfolio item not found",
         });
      }

      res.json({
         success: true,
         data: portfolio,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   POST /api/portfolio
// @desc    Create portfolio item
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
   try {
      const portfolioData = {
         ...req.body,
         technologies: req.body.technologies ? JSON.parse(req.body.technologies) : [],
      };

      if (req.file) {
         portfolioData.image = `/uploads/${req.file.filename}`;
      }

      const portfolio = await Portfolio.create(portfolioData);

      res.status(201).json({
         success: true,
         data: portfolio,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   PUT /api/portfolio/:id
// @desc    Update portfolio item
// @access  Private
router.put("/:id", protect, upload.single("image"), async (req, res) => {
   try {
      let portfolio = await Portfolio.findById(req.params.id);

      if (!portfolio) {
         return res.status(404).json({
            success: false,
            message: "Portfolio item not found",
         });
      }

      const updateData = { ...req.body };
      if (req.body.technologies && typeof req.body.technologies === "string") {
         updateData.technologies = JSON.parse(req.body.technologies);
      }

      if (req.file) {
         updateData.image = `/uploads/${req.file.filename}`;
      }

      portfolio = await Portfolio.findByIdAndUpdate(req.params.id, updateData, {
         new: true,
         runValidators: true,
      });

      res.json({
         success: true,
         data: portfolio,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   DELETE /api/portfolio/:id
// @desc    Delete portfolio item
// @access  Private
router.delete("/:id", protect, async (req, res) => {
   try {
      const portfolio = await Portfolio.findById(req.params.id);

      if (!portfolio) {
         return res.status(404).json({
            success: false,
            message: "Portfolio item not found",
         });
      }

      await portfolio.deleteOne();

      res.json({
         success: true,
         message: "Portfolio item deleted successfully",
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
