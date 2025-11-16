const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please provide your name"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Please provide your email"],
         lowercase: true,
         trim: true,
         match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: {
         type: String,
         trim: true,
      },
      projectType: {
         type: String,
         enum: ["Web Development", "Branding & Design", "App Development", "Other"],
         default: "Other",
      },
      message: {
         type: String,
         required: [true, "Please provide a message"],
         trim: true,
      },
      status: {
         type: String,
         enum: ["new", "read", "replied", "archived"],
         default: "new",
      },
      notes: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);

// Index for efficient querying
contactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);
