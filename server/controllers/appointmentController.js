const Appointment = require("../models/Appointment");
const sendEmail = require("../utils/sendEmail");

/* ===============================
   Create Appointment (Client)
================================ */
exports.createAppointment = async (req, res) => {
  try {
    const { attorney, date, time, reason } = req.body;

    // Validation
    if (!attorney || !date || !time || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const appointment = await Appointment.create({
      client: req.user.id,
      attorney,
      date,
      time,
      reason,
      status: "pending",
    });

    res.status(201).json({
      message: "Appointment request sent to attorney",
      appointment,
    });

  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   Get My Appointments
================================ */
exports.getMyAppointments = async (req, res) => {
  try {

    let appointments = [];

    if (req.user.role === "client") {

      appointments = await Appointment.find({
        client: req.user.id,
      })
        .populate("attorney", "name email specialization")
        .sort({ createdAt: -1 });

    }

    if (req.user.role === "attorney") {

      appointments = await Appointment.find({
        attorney: req.user.id,
      })
        .populate("client", "name email")
        .sort({ createdAt: -1 });

    }

    res.json(appointments);

  } catch (error) {
    console.error("Get Appointment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   Update Appointment Status
   (Attorney approves/rejects)
================================ */
exports.updateAppointmentStatus = async (req, res) => {
  try {

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate("client", "name email")
      .populate("attorney", "name email");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Only assigned attorney can update
    if (appointment.attorney._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this appointment",
      });
    }

    appointment.status = status;
    await appointment.save();


    /* ===============================
       Email Notifications
    ================================ */

    if (status === "approved") {

      // Email to client
      await sendEmail(
        appointment.client.email,
        "Appointment Approved",
        `Hello ${appointment.client.name},

Your appointment with ${appointment.attorney.name} has been APPROVED.

Date: ${appointment.date}
Time: ${appointment.time}

Please be available at the scheduled time.

Thank you,
OAASS System`
      );

      // Email to attorney
      await sendEmail(
        appointment.attorney.email,
        "Appointment Confirmed",
        `Hello ${appointment.attorney.name},

You approved an appointment.

Client: ${appointment.client.name}
Date: ${appointment.date}
Time: ${appointment.time}

Thank you,
OAASS System`
      );

    }


    if (status === "rejected") {

      await sendEmail(
        appointment.client.email,
        "Appointment Rejected",
        `Hello ${appointment.client.name},

Your appointment request with ${appointment.attorney.name} was REJECTED.

Date: ${appointment.date}
Time: ${appointment.time}

Please try booking another slot.

Thank you,
OAASS System`
      );

    }


    res.json({
      message: "Appointment status updated successfully",
      appointment,
    });

  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};