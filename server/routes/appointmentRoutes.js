
const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Client books
router.post("/", protect, createAppointment);

// Client / Attorney view
router.get("/my", protect, getMyAppointments);

// Attorney approve / reject
router.put(
  "/:id",
  protect,
  authorize("attorney"),
  updateAppointmentStatus
);

module.exports = router;

