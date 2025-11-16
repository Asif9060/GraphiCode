const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: [true, "Please provide a blog title"],
         trim: true,
      },
      slug: {
         type: String,
         unique: true,
         lowercase: true,
         trim: true,
      },
      excerpt: {
         type: String,
         required: [true, "Please provide a blog excerpt"],
         trim: true,
         maxlength: 300,
      },
      content: {
         type: String,
         required: [true, "Please provide blog content"],
      },
      featuredImage: {
         type: String,
         required: [true, "Please provide a featured image"],
      },
      author: {
         type: String,
         required: [true, "Please provide author name"],
         trim: true,
         default: "GraphiCode Team",
      },
      category: {
         type: String,
         required: [true, "Please provide a category"],
         enum: [
            "web-design",
            "app-development",
            "branding",
            "marketing",
            "technology",
            "tutorials",
         ],
         default: "web-design",
      },
      tags: [
         {
            type: String,
            trim: true,
         },
      ],
      featured: {
         type: Boolean,
         default: false,
      },
      published: {
         type: Boolean,
         default: false,
      },
      publishDate: {
         type: Date,
         default: Date.now,
      },
      views: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

// Auto-generate slug from title
blogSchema.pre("save", function (next) {
   if (this.isModified("title") && !this.slug) {
      this.slug = this.title
         .toLowerCase()
         .replace(/[^\w\s-]/g, "")
         .replace(/\s+/g, "-")
         .replace(/--+/g, "-")
         .trim();
   }
   next();
});

// Index for efficient querying
blogSchema.index({ slug: 1, published: 1, publishDate: -1 });

module.exports = mongoose.model("Blog", blogSchema);
