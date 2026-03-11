const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "attorney", "admin"],
      default: "client",
    },
    phone: {
      type: String,
    },

    bio: {
      type: String,
    },

    specialization: {
      type: String,
      trim: true,
    },
        experience: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);