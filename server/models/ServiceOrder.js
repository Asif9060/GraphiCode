const mongoose = require("mongoose");

const orderUpdateSchema = new mongoose.Schema(
   {
      status: {
         type: String,
         enum: ["pending", "in-progress", "in-review", "completed"],
         default: "pending",
      },
      note: {
         type: String,
         trim: true,
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
      createdBy: {
         type: String,
         trim: true,
      },
   },
   { _id: false }
);

const serviceOrderSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      service: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Service",
         required: true,
      },
      brief: {
         type: String,
         trim: true,
         maxlength: 2000,
      },
      status: {
         type: String,
         enum: ["pending", "in-progress", "in-review", "completed"],
         default: "pending",
      },
      updates: [orderUpdateSchema],
   },
   {
      timestamps: true,
   }
);

serviceOrderSchema.pre("save", function (next) {
   if (this.isNew && (!this.updates || this.updates.length === 0)) {
      this.updates = [
         {
            status: this.status,
            note: "Service request created",
         },
      ];
   }
   next();
});

module.exports = mongoose.model("ServiceOrder", serviceOrderSchema);
