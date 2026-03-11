import AppointmentCalendar from "../components/AppointmentCalendar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";

function AttorneyDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [filter, setFilter] = useState("all");

  const filteredAppointments =
  filter === "all"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my");
      setAppointments(
        res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}`, { status });

      setMessage(
        status === "approved"
          ? "Appointment Approved Successfully ✅"
          : "Appointment Rejected Successfully ❌"
      );

      setMessageType(status === "approved" ? "success" : "error");

      fetchAppointments();
      setSelectedAppointment(null);

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

{/* Navbar */}
<div className="bg-gray-900 text-white p-4 flex justify-between items-center">
  <h1 className="text-xl font-semibold">Attorney Dashboard</h1>

  <div className="flex gap-3">
    <button
      onClick={() => navigate("/profile")}
      className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
    >
      Profile
    </button>
              <button
    onClick={() => navigate("/chat")}
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
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

      {/* Success Popup */}
      {message && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 text-white transition-all duration-300 ${
            messageType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">
          Welcome, {user?.name}
        </h2>

        <div className="flex gap-4 mb-6">
  {["all", "pending", "approved", "rejected"].map((type) => (
    <button
      key={type}
      onClick={() => setFilter(type)}
      className={`px-4 py-2 rounded-full capitalize ${
        filter === type
          ? "bg-orange-600 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {type}
    </button>
  ))}
</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-gray-500 text-sm">Total</p>
    <p className="text-2xl font-bold">{appointments.length}</p>
  </div>

  <div className="bg-yellow-100 p-4 rounded-xl">
    <p className="text-sm">Pending</p>
    <p className="text-2xl font-bold">
      {appointments.filter(a => a.status === "pending").length}
    </p>
  </div>

  

  <div className="bg-green-100 p-4 rounded-xl">
    <p className="text-sm">Approved</p>
    <p className="text-2xl font-bold">
      {appointments.filter(a => a.status === "approved").length}
    </p>
  </div>

  <div className="bg-red-100 p-4 rounded-xl">
    <p className="text-sm">Rejected</p>
    <p className="text-2xl font-bold">
      {appointments.filter(a => a.status === "rejected").length}
    </p>
  </div>
</div>

        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAppointments.map((appt) => (
              <div
                key={appt._id}
                onClick={() => setSelectedAppointment(appt)}
                className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition"
              >
                <p><strong>Client:</strong> {appt.client?.name}</p>
                              <p>
                <strong>Date:</strong>{" "}
                {new Date(appt.date).toLocaleDateString("en-GB")}
              </p>
                <p>
                  <strong>Status:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        appt.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appt.status}
                    </span>
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Click to view details
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl relative">

            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-6">
              Appointment Details
            </h3>

            <div className="space-y-3">
              <p><strong>Client Name:</strong> {selectedAppointment.client?.name}</p>
              <p><strong>Email:</strong> {selectedAppointment.client?.email}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedAppointment.date).toLocaleDateString("en-GB")}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {new Date(selectedAppointment.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="font-semibold capitalize">
                  {selectedAppointment.status}
                </span>
              </p>
            </div>

            {selectedAppointment.status.toLowerCase() === "pending" && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() =>
                    updateStatus(selectedAppointment._id, "approved")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(selectedAppointment._id, "rejected")
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}

          </div>
        </div>
      )}

        <div>
      <AppointmentCalendar />
        </div>
    </div>
  );
}

export default AttorneyDashboard;