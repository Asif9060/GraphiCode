const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/Service");
const Testimonial = require("../models/Testimonial");
const Blog = require("../models/Blog");
const Contact = require("../models/Contact");

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/dashboard/stats", protect, async (req, res) => {
   try {
      const stats = {
         portfolio: await Portfolio.countDocuments({ isActive: true }),
         services: await Service.countDocuments({ isActive: true }),
         testimonials: await Testimonial.countDocuments({ isActive: true }),
         blogs: await Blog.countDocuments({ published: true }),
         contacts: {
            total: await Contact.countDocuments(),
            new: await Contact.countDocuments({ status: "new" }),
            read: await Contact.countDocuments({ status: "read" }),
            replied: await Contact.countDocuments({ status: "replied" }),
         },
      };

      res.json({
         success: true,
         data: stats,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   GET /api/admin/portfolio
// @desc    Get all portfolio items (including inactive)
// @access  Private
router.get("/portfolio", protect, async (req, res) => {
   try {
      const portfolioItems = await Portfolio.find().sort({ order: 1, createdAt: -1 });

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

// @route   GET /api/admin/services
// @desc    Get all services (including inactive)
// @access  Private
router.get("/services", protect, async (req, res) => {
   try {
      const services = await Service.find().sort({ order: 1 });

      res.json({
         success: true,
         count: services.length,
         data: services,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   GET /api/admin/testimonials
// @desc    Get all testimonials (including inactive)
// @access  Private
router.get("/testimonials", protect, async (req, res) => {
   try {
      const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

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

// @route   GET /api/admin/blog
// @desc    Get all blog posts (including unpublished)
// @access  Private
router.get("/blog", protect, async (req, res) => {
   try {
      const blogs = await Blog.find().sort({ createdAt: -1 });

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

module.exports = router;
