import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    bio: "",
    phoneNumber: ""
  });

  const [role, setRole] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Fetch profile from database
  const fetchProfile = async () => {
    try {

      const res = await API.get("/users/profile");

      setProfileData(res.data);
      setRole(res.data.role);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {

      await API.put("/users/profile", profileData);

      alert("Profile updated successfully");

      setEditMode(false);

      fetchProfile();

    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 p-8">

            <button
            onClick={() =>
                navigate(user?.role === "attorney" ? "/attorney-dashboard" : "/client-dashboard")
            }
            className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
            ← Back
            </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Profile Header */}

        <div className="flex items-center gap-6 mb-8">

          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
            className="w-24 h-24 rounded-full border"
          />

          <div>
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-gray-500">{profileData.email}</p>
            <p className="text-sm text-gray-400 capitalize">{role}</p>
          </div>

          <div className="ml-auto">

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit 
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            )}

          </div>

        </div>

        {/* Profile Form */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* Name */}

          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
            <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                    type="text"
                    name="phone"
                    value={profileData.phone || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full border p-2 rounded"
                />
            </div>

          {/* Attorney Fields */}

          {role === "attorney" && (
            <>
              <div>
                <label className="block font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={profileData.specialization || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={profileData.experience || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full border p-2 rounded"
                />
              </div>
            </>
          )}

        </div>

        {/* Bio only for attorneys */}

        {role === "attorney" && (
          <div className="mt-6">
            <label className="block font-semibold mb-1">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={profileData.bio || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          
        )}

      </div>

    </div>
  );
}

export default Profile;