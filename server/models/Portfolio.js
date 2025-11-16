const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: [true, "Please provide a project title"],
         trim: true,
      },
      description: {
         type: String,
         required: [true, "Please provide a project description"],
         trim: true,
      },
      category: {
         type: String,
         required: [true, "Please provide a category"],
         enum: ["web", "branding", "apps"],
         lowercase: true,
      },
      image: {
         type: String,
         required: [true, "Please provide an image URL"],
      },
      link: {
         type: String,
         trim: true,
      },
      technologies: [
         {
            type: String,
            trim: true,
         },
      ],
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
portfolioSchema.index({ category: 1, featured: -1, order: 1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
