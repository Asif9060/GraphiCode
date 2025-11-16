const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const { protect } = require("../middleware/auth");

// @route   GET /api/testimonials
// @desc    Get all testimonials (public)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const { featured } = req.query;
      let query = { isActive: true };

      if (featured === "true") {
         query.featured = true;
      }

      const testimonials = await Testimonial.find(query).sort({
         order: 1,
         createdAt: -1,
      });

      res.json({
         success: true,
         count: testimonials.length,
         data: testimonials,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial
// @access  Public
router.get("/:id", async (req, res) => {
   try {
      const testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
         return res.status(404).json({
            success: false,
            message: "Testimonial not found",
         });
      }

      res.json({
         success: true,
         data: testimonial,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   POST /api/testimonials
// @desc    Create testimonial
// @access  Private
router.post("/", protect, async (req, res) => {
   try {
      const testimonial = await Testimonial.create(req.body);

      res.status(201).json({
         success: true,
         data: testimonial,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private
router.put("/:id", protect, async (req, res) => {
   try {
      let testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
         return res.status(404).json({
            success: false,
            message: "Testimonial not found",
         });
      }

      testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });

      res.json({
         success: true,
         data: testimonial,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private
router.delete("/:id", protect, async (req, res) => {
   try {
      const testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
         return res.status(404).json({
            success: false,
            message: "Testimonial not found",
         });
      }

      await testimonial.deleteOne();

      res.json({
         success: true,
         message: "Testimonial deleted successfully",
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
