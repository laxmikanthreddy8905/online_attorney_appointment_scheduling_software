const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Get all users
router.get(
  "/users",
  protect,
  authorize("admin"),
  async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
  }
);

// Get all appointments
router.get(
  "/appointments",
  protect,
  authorize("admin"),
  async (req, res) => {
    const appointments = await Appointment.find()
      .populate("client", "name email")
      .populate("attorney", "name email");

    res.json(appointments);
  }
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  }
);

// Delete appointment
router.delete(
  "/appointments/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  }
);

module.exports = router;