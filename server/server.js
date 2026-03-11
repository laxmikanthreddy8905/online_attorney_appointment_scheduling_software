const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const attorneyRoutes = require("./routes/attorneyRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- HTTP SERVER ---------------- */

const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

/* Temporary memory store (later use DB) */
let appointments = [];

/* Socket connection */
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  /* -------- Chat System -------- */

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  socket.on("sendMessage", ({ roomId, message, sender }) => {

    io.to(roomId).emit("receiveMessage", {
      message,
      sender
    });

  });

  /* -------- Appointment Booking -------- */

  socket.emit("loadAppointments", appointments);

  socket.on("bookAppointment", (data) => {

    appointments.push(data);

    /* Broadcast to all users */
    io.emit("newAppointment", data);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.send("API Running...");
});

/* Protected Test Route */

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user
  });
});

/* API Routes */

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attorneys", attorneyRoutes);

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);