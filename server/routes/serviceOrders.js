const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const ServiceOrder = require("../models/ServiceOrder");
const Service = require("../models/Service");
const { userProtect } = require("../middleware/userAuth");
const { protect: adminProtect } = require("../middleware/auth");

// Create a new service order (user)
router.post(
   "/",
   userProtect,
   [
      body("serviceId").notEmpty().withMessage("Service id is required"),
      body("brief")
         .optional()
         .isLength({ max: 2000 })
         .withMessage("Brief is too long"),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ success: false, errors: errors.array() });
      }

      try {
         const { serviceId, brief } = req.body;
         const service = await Service.findById(serviceId);

         if (!service) {
            return res.status(404).json({
               success: false,
               message: "Service not found",
            });
         }

         const order = await ServiceOrder.create({
            user: req.user._id,
            service: service._id,
            brief,
         });

         const populated = await order.populate("service", "title icon shortDescription");

         res.status(201).json({
            success: true,
            data: populated,
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: "Unable to create service order",
            error: error.message,
         });
      }
   }
);

// Get current user's orders
router.get("/", userProtect, async (req, res) => {
   try {
      const orders = await ServiceOrder.find({ user: req.user._id })
         .populate("service", "title icon shortDescription")
         .sort({ createdAt: -1 });

      res.json({
         success: true,
         data: orders,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Unable to fetch service orders",
         error: error.message,
      });
   }
});

// Admin: Get all orders
router.get("/admin/all", adminProtect, async (req, res) => {
   try {
      const orders = await ServiceOrder.find()
         .populate("user", "name email")
         .populate("service", "title")
         .sort({ createdAt: -1 });

      res.json({
         success: true,
         data: orders,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Unable to fetch orders",
         error: error.message,
      });
   }
});

// Admin: Update status / add update
router.patch(
   "/:id/status",
   adminProtect,
   [
      body("status")
         .optional()
         .isIn(["pending", "in-progress", "in-review", "completed"])
         .withMessage("Invalid status"),
      body("note").optional().isLength({ max: 2000 }).withMessage("Note too long"),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ success: false, errors: errors.array() });
      }

      try {
         const order = await ServiceOrder.findById(req.params.id);
         if (!order) {
            return res.status(404).json({
               success: false,
               message: "Service order not found",
            });
         }

         if (req.body.status) {
           order.status = req.body.status;
         }

         order.updates.push({
            status: req.body.status || order.status,
            note: req.body.note,
            createdBy: req.admin ? req.admin.name : "System",
         });

         await order.save();
         const populated = await order
            .populate("user", "name email")
            .populate("service", "title");

         res.json({ success: true, data: populated });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: "Unable to update service order",
            error: error.message,
         });
      }
   }
);

// User: get single order (ensure ownership)
router.get("/:id", userProtect, async (req, res) => {
   try {
      const order = await ServiceOrder.findOne({ _id: req.params.id, user: req.user._id })
         .populate("service", "title icon shortDescription");

      if (!order) {
         return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.json({ success: true, data: order });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Unable to fetch order",
         error: error.message,
      });
   }
});

module.exports = router;
