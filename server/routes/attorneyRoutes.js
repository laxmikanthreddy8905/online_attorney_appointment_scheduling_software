const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// CREATE attorney profile
router.post("/", protect, async (req, res) => {
  try {
    const { specialization, experience, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user || user.role !== "attorney") {
      return res.status(403).json({ message: "Only attorneys can create profile" });
    }

    user.specialization = specialization;
    user.experience = experience;
    user.bio = bio;

    await user.save();

    res.json({
      message: "Attorney profile created",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET attorney profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE attorney profile
router.put("/me", protect, async (req, res) => {
  try {
    const { specialization, experience, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.specialization = specialization || user.specialization;
      user.experience = experience || user.experience;
      user.bio = bio || user.bio;

      const updatedUser = await user.save();

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;    