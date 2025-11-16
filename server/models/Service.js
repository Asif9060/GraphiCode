const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: [true, "Please provide a service title"],
         trim: true,
      },
      icon: {
         type: String,
         required: [true, "Please provide an icon (e.g., W, G, A)"],
         trim: true,
         maxlength: 3,
      },
      shortDescription: {
         type: String,
         required: [true, "Please provide a short description"],
         trim: true,
         maxlength: 200,
      },
      fullDescription: {
         type: String,
         trim: true,
      },
      features: [
         {
            type: String,
            trim: true,
         },
      ],
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

// Index for ordering
serviceSchema.index({ order: 1 });

module.exports = mongoose.model("Service", serviceSchema);
