const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { userProtect } = require("../middleware/userAuth");

const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
   });

// POST /api/users/register
router.post(
   "/register",
   [
      body("name").trim().notEmpty().withMessage("Name is required"),
      body("email").isEmail().withMessage("Valid email is required"),
      body("password")
         .isLength({ min: 6 })
         .withMessage("Password must be at least 6 characters"),
      body("phone")
         .optional()
         .isLength({ min: 10 })
         .withMessage("Please provide a valid phone number"),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ success: false, errors: errors.array() });
      }

      try {
         const { name, email, password, phone } = req.body;
         const existing = await User.findOne({ email });
         if (existing) {
            return res.status(400).json({
               success: false,
               message: "An account with this email already exists",
            });
         }

         const user = await User.create({ name, email, password, phone });
         const token = generateToken(user._id);

         res.status(201).json({
            success: true,
            data: {
               token,
               user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
               },
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

// POST /api/users/login
router.post(
   "/login",
   [
      body("email").isEmail().withMessage("Valid email is required"),
      body("password").notEmpty().withMessage("Password is required"),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ success: false, errors: errors.array() });
      }

      try {
         const { email, password } = req.body;
         const user = await User.findOne({ email }).select("+password");

         if (!user) {
            return res.status(401).json({
               success: false,
               message: "Invalid credentials",
            });
         }

         const passwordMatch = await user.comparePassword(password);
         if (!passwordMatch) {
            return res.status(401).json({
               success: false,
               message: "Invalid credentials",
            });
         }

         const token = generateToken(user._id);
         user.password = undefined;

         res.json({
            success: true,
            data: {
               token,
               user,
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

// GET /api/users/me
router.get("/me", userProtect, (req, res) => {
   res.json({
      success: true,
      data: req.user,
   });
});

module.exports = router;
