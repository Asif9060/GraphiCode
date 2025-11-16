const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const { protect } = require("../middleware/auth");

// @route   GET /api/services
// @desc    Get all services (public)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const services = await Service.find({ isActive: true }).sort({ order: 1 });

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

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get("/:id", async (req, res) => {
   try {
      const service = await Service.findById(req.params.id);

      if (!service) {
         return res.status(404).json({
            success: false,
            message: "Service not found",
         });
      }

      res.json({
         success: true,
         data: service,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   POST /api/services
// @desc    Create service
// @access  Private
router.post("/", protect, async (req, res) => {
   try {
      const serviceData = {
         ...req.body,
         features: req.body.features
            ? Array.isArray(req.body.features)
               ? req.body.features
               : JSON.parse(req.body.features)
            : [],
      };

      const service = await Service.create(serviceData);

      res.status(201).json({
         success: true,
         data: service,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private
router.put("/:id", protect, async (req, res) => {
   try {
      let service = await Service.findById(req.params.id);

      if (!service) {
         return res.status(404).json({
            success: false,
            message: "Service not found",
         });
      }

      const updateData = { ...req.body };
      if (req.body.features && typeof req.body.features === "string") {
         updateData.features = JSON.parse(req.body.features);
      }

      service = await Service.findByIdAndUpdate(req.params.id, updateData, {
         new: true,
         runValidators: true,
      });

      res.json({
         success: true,
         data: service,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private
router.delete("/:id", protect, async (req, res) => {
   try {
      const service = await Service.findById(req.params.id);

      if (!service) {
         return res.status(404).json({
            success: false,
            message: "Service not found",
         });
      }

      await service.deleteOne();

      res.json({
         success: true,
         message: "Service deleted successfully",
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
