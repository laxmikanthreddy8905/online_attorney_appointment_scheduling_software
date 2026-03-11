import { io } from "socket.io-client";

const socket = io("https://online-attorney-appointment-scheduling-nbkp.onrender.com");

export default socket;