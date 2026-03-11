const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");


// GET ALL ATTORNEYS
router.get("/attorneys", protect, async (req, res) => {
  try {

    const attorneys = await User.find({ role: "attorney" }).select("-password");

    res.json(attorneys);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET LOGGED-IN USER PROFILE
router.get("/profile", protect, async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// UPDATE PROFILE
router.put("/profile", protect, async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    // email duplicate check
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });

      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      user.email = req.body.email;
    }

    // attorney extra fields
    if (user.role === "attorney") {
      user.specialization = req.body.specialization || user.specialization;
      user.bio = req.body.bio || user.bio;
      user.experience = req.body.experience || user.experience;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      specialization: updatedUser.specialization,
      bio: updatedUser.bio,
      experience: updatedUser.experience
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;