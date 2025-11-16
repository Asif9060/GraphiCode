const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
   try {
      let token;

      // Check for token in header
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         token = req.headers.authorization.split(" ")[1];
      }

      // Make sure token exists
      if (!token) {
         return res.status(401).json({
            success: false,
            message: "Not authorized to access this route. Please login.",
         });
      }

      try {
         // Verify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         // Get admin from token
         req.admin = await Admin.findById(decoded.id).select("-password");

         if (!req.admin || !req.admin.isActive) {
            return res.status(401).json({
               success: false,
               message: "Admin account not found or inactive",
            });
         }

         next();
      } catch (err) {
         return res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
         });
      }
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error in authentication",
      });
   }
};

// Authorize specific roles
exports.authorize = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.admin.role)) {
         return res.status(403).json({
            success: false,
            message: `Role ${req.admin.role} is not authorized to access this route`,
         });
      }
      next();
   };
};
