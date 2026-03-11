import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import AttorneyDashboard from "./pages/AttorneyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Attorneys from "./pages/Attorneys";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/attorney" element={<AttorneyDashboard />} />
      <Route path="/attorneys" element={<Attorneys />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<Chat />} />
      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute role="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attorney-dashboard"
        element={
          <ProtectedRoute role="attorney">
            <AttorneyDashboard />
          </ProtectedRoute>
        }
      />
      
    </Routes>
  );
}

export default App;