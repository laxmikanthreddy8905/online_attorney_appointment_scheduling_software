import React, { useEffect, useState } from "react";
import axios from "axios";

const Attorneys = () => {

  const [attorneys, setAttorneys] = useState([]);

  useEffect(() => {
    fetchAttorneys();
  }, []);

  const fetchAttorneys = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/attorneys", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      
      setAttorneys(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Available Attorneys</h2>

      {attorneys.map((attorney) => (
        <div key={attorney._id} style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px"
        }}>
          <h3>{attorney.name}</h3>
          <p><b>Specialization:</b> {attorney.specialization}</p>
          <p><b>Experience:</b> {attorney.experience} years</p>
          <p>{attorney.bio}</p>

          <button>Book Appointment</button>

        </div>
      ))}
    </div>
  );
};

export default Attorneys;