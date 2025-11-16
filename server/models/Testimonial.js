const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please provide client name"],
         trim: true,
      },
      position: {
         type: String,
         required: [true, "Please provide client position/title"],
         trim: true,
      },
      company: {
         type: String,
         trim: true,
      },
      avatar: {
         type: String,
         default: "",
      },
      rating: {
         type: Number,
         required: [true, "Please provide a rating"],
         min: 1,
         max: 5,
         default: 5,
      },
      testimonial: {
         type: String,
         required: [true, "Please provide testimonial text"],
         trim: true,
      },
      featured: {
         type: Boolean,
         default: false,
      },
      order: {
         type: Number,
         default: 0,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

// Index for efficient querying
testimonialSchema.index({ featured: -1, order: 1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
