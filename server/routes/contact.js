const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect } = require("../middleware/auth");

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post("/", async (req, res) => {
   try {
      const contact = await Contact.create(req.body);

      res.status(201).json({
         success: true,
         message: "Thank you for contacting us! We will get back to you soon.",
         data: contact,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error submitting contact form",
         error: error.message,
      });
   }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
// @access  Private
router.get("/", protect, async (req, res) => {
   try {
      const { status } = req.query;
      let query = {};

      if (status) {
         query.status = status;
      }

      const contacts = await Contact.find(query).sort({ createdAt: -1 });

      res.json({
         success: true,
         count: contacts.length,
         data: contacts,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   GET /api/contact/:id
// @desc    Get single contact message
// @access  Private
router.get("/:id", protect, async (req, res) => {
   try {
      const contact = await Contact.findById(req.params.id);

      if (!contact) {
         return res.status(404).json({
            success: false,
            message: "Contact message not found",
         });
      }

      // Mark as read if status is new
      if (contact.status === "new") {
         contact.status = "read";
         await contact.save();
      }

      res.json({
         success: true,
         data: contact,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   PUT /api/contact/:id
// @desc    Update contact message status/notes
// @access  Private
router.put("/:id", protect, async (req, res) => {
   try {
      let contact = await Contact.findById(req.params.id);

      if (!contact) {
         return res.status(404).json({
            success: false,
            message: "Contact message not found",
         });
      }

      contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });

      res.json({
         success: true,
         data: contact,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error",
         error: error.message,
      });
   }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message
// @access  Private
router.delete("/:id", protect, async (req, res) => {
   try {
      const contact = await Contact.findById(req.params.id);

      if (!contact) {
         return res.status(404).json({
            success: false,
            message: "Contact message not found",
         });
      }

      await contact.deleteOne();

      res.json({
         success: true,
         message: "Contact message deleted successfully",
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
