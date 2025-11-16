const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
   });
};

// @route   POST /api/auth/register
// @desc    Register a new admin (protected - only superadmin can create)
// @access  Private
router.post(
   "/register",
   [
      body("name").trim().notEmpty().withMessage("Name is required"),
      body("email").isEmail().withMessage("Please provide a valid email"),
      body("password")
         .isLength({ min: 6 })
         .withMessage("Password must be at least 6 characters"),
   ],
   async (req, res) => {
      try {
         const { name, email, password, role } = req.body;

         // Check if admin already exists
         const adminExists = await Admin.findOne({ email });
         if (adminExists) {
            return res.status(400).json({
               success: false,
               message: "Admin with this email already exists",
            });
         }

         // Create admin
         const admin = await Admin.create({
            name,
            email,
            password,
            role: role || "admin",
         });

         const token = generateToken(admin._id);

         res.status(201).json({
            success: true,
            data: {
               id: admin._id,
               name: admin.name,
               email: admin.email,
               role: admin.role,
               token,
            },
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message,
         });
      }
   }
);

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post(
   "/login",
   [
      body("email").isEmail().withMessage("Please provide a valid email"),
      body("password").notEmpty().withMessage("Password is required"),
   ],
   async (req, res) => {
      try {
         const { email, password } = req.body;

         // Check if admin exists
         const admin = await Admin.findOne({ email }).select("+password");
         if (!admin) {
            return res.status(401).json({
               success: false,
               message: "Invalid credentials",
            });
         }

         // Check if admin is active
         if (!admin.isActive) {
            return res.status(401).json({
               success: false,
               message: "Account is inactive. Please contact administrator.",
            });
         }

         // Check password
         const isPasswordMatch = await admin.comparePassword(password);
         if (!isPasswordMatch) {
            return res.status(401).json({
               success: false,
               message: "Invalid credentials",
            });
         }

         // Update last login
         admin.lastLogin = Date.now();
         await admin.save();

         const token = generateToken(admin._id);

         res.json({
            success: true,
            data: {
               id: admin._id,
               name: admin.name,
               email: admin.email,
               role: admin.role,
               token,
            },
         });
      } catch (error) {
         res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message,
         });
      }
   }
);

// @route   GET /api/auth/me
// @desc    Get current logged in admin
// @access  Private
router.get("/me", require("../middleware/auth").protect, async (req, res) => {
   try {
      res.json({
         success: true,
         data: req.admin,
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
