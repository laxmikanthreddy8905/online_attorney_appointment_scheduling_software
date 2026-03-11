import AppointmentCalendar from "../components/AppointmentCalendar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  

  const [appointments, setAppointments] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attorneyId, setAttorneyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my");
      setAppointments(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Fetch attorneys
  const fetchAttorneys = async () => {
    try {
      const res = await API.get("/users/attorneys");
      setAttorneys(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchAttorneys();
  }, []);

  // Book appointment
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!attorneyId || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

await API.post("/appointments", {
  attorney: attorneyId,   // rename here
  date,
  time,
  reason,  // temporary default
});

      alert("Appointment booked successfully!");

      setDate("");
      setTime("");
      setAttorneyId("");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
 
      

        {/* Navbar */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Client Dashboard</h1>



          <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
            >
              Profile
            </button>

                      <button
    onClick={() => navigate("/chat")}
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Chat
  </button>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      <div className="p-8 max-w-6xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Welcome, {user?.name}
        </h2>

        {/* Booking Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h3 className="text-xl font-semibold mb-4">
            Book Appointment
          </h3>

          <form onSubmit={handleBooking} className="grid md:grid-cols-4 gap-4">

            <select
              value={attorneyId}
              onChange={(e) => setAttorneyId(e.target.value)}
              required
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Attorney</option>
              {attorneys.map((attorney) => (
                <option key={attorney._id} value={attorney._id}>
                  {attorney.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Booking..." : "Book"}
            </button>

            <input
  type="text"
  placeholder="Reason for appointment"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  required
  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

          </form>
        </div>

        {/* Appointments Section */}
        <h3 className="text-xl font-semibold mb-4">
          My Appointments
        </h3>

        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white p-5 rounded-xl shadow-md border-l-4"
                style={{
                  borderColor:
                    appt.status === "approved"
                      ? "green"
                      : appt.status === "rejected"
                      ? "red"
                      : "orange",
                }}
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appt.date).toLocaleDateString()}
                </p>
                <p><strong>Time:</strong> {appt.time}</p>

                <p className="mt-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold capitalize ${
                      appt.status === "approved"
                        ? "text-green-600"
                        : appt.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {appt.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

        <div>
      <AppointmentCalendar />
          </div>
    </div>

    
  );
}

export default ClientDashboard;