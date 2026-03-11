const mongoose = require("mongoose");

const attorneySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    specialization: String,
    experience: Number,
    fees: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attorney", attorneySchema);