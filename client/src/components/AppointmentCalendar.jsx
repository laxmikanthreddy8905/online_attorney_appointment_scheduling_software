import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

/* connect to backend socket */
const socket = io("http://localhost:5000");

export default function AppointmentCalendar() {

  const [events, setEvents] = useState([]);

  /* load existing appointments */

  useEffect(() => {

    socket.on("loadAppointments", (data) => {
      setEvents(data);
    });

    socket.on("newAppointment", (data) => {
      setEvents((prevEvents) => [...prevEvents, data]);
    });

    return () => {
      socket.off("loadAppointments");
      socket.off("newAppointment");
    };

  }, []);

  /* when user clicks calendar slot */

  const handleDateClick = (info) => {

    const title = prompt("Enter Appointment Title");

    if (!title) return;

    const appointment = {
      title,
      start: info.dateStr
    };

    /* send appointment to server */

    socket.emit("bookAppointment", appointment);

  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        Appointment Calendar
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={false}
        events={events}
        dateClick={handleDateClick}
        height="80vh"
      />

    </div>
  );
}