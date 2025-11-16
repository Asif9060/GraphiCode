const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Import routes
const portfolioRoutes = require("./routes/portfolio");
const servicesRoutes = require("./routes/services");
const testimonialsRoutes = require("./routes/testimonials");
const blogRoutes = require("./routes/blog");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userAuthRoutes = require("./routes/userAuth");
const serviceOrdersRoutes = require("./routes/serviceOrders");

const app = express();

// Middleware
app.use(cors({
  origin: ['https://graphi-code-kappa.vercel.app', 'http://localhost:8000', 'http://127.0.0.1:8000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "..")));

// MongoDB Connection
mongoose
   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/graphicode", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("✅ MongoDB Connected Successfully"))
   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userAuthRoutes);
app.use("/api/service-orders", serviceOrdersRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
   res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
   });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
   res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});
