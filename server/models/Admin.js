const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please provide a name"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Please provide an email"],
         unique: true,
         lowercase: true,
         trim: true,
         match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      password: {
         type: String,
         required: [true, "Please provide a password"],
         minlength: 6,
         select: false,
      },
      role: {
         type: String,
         enum: ["admin", "superadmin"],
         default: "admin",
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      lastLogin: {
         type: Date,
      },
   },
   {
      timestamps: true,
   }
);

// Encrypt password before saving
adminSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 12);
   next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
