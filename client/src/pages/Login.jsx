import loginImage from "../assets/loginimage.jpg";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://online-attorney-appointment-scheduling-nbkp.onrender.com",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "client") {
        navigate("/client");
      } else {
        navigate("/attorney");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      
 {/* Left Side Branding */}
<div
  className="hidden md:flex w-1/2 text-white items-center justify-center p-10 bg-cover bg-center"
  style={{ backgroundImage: `url(${loginImage})` }}
>
  <div className="bg-black/40 p-8 rounded-lg text-center">
    <h1 className="text-4xl font-bold mb-4">
      Online Attorney Appointment Scheduling Software
    </h1>

    <p className="text-lg opacity-90">
      Book trusted legal consultations easily and securely.
    </p>
  </div>
</div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition duration-300 font-semibold"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;