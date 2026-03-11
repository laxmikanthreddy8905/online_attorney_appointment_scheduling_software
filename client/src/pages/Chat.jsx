import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  // Logged-in user (replace with your auth user)
const currentUser = localStorage.getItem("userName");
const otherUser = localStorage.getItem("attorneyName");

  const sendMessage = () => {
    if (!text && !file) return;

    const newMsg = {
      sender: currentUser,
      text: text,
      file: file ? URL.createObjectURL(file) : null,
      type: file?.type?.startsWith("image") ? "image" : "file",
      time: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMsg]);
    setText("");
    setFile(null);
  };

  return (
    <div style={styles.container}>

      {/* Chat Header */}
      <div style={styles.header}>
        Chat with {otherUser}
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === currentUser
                ? styles.myMessage
                : styles.otherMessage
            }
          >
            {msg.text && <div>{msg.text}</div>}

            {msg.file && msg.type === "image" && (
              <img
                src={msg.file}
                alt="upload"
                style={{ maxWidth: "200px", marginTop: 5 }}
              />
            )}

            {msg.file && msg.type === "file" && (
              <a href={msg.file} download>
                Download File
              </a>
            )}

            <div style={styles.time}>{msg.time}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    border: "1px solid #ccc"
  },

  header: {
    background: "#16a34a",
    color: "white",
    padding: "12px",
    fontWeight: "bold"
  },

  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    background: "#f3f4f6"
  },

  myMessage: {
    background: "#dcf8c6",
    padding: "8px",
    margin: "5px",
    borderRadius: "8px",
    maxWidth: "60%",
    marginLeft: "auto"
  },

  otherMessage: {
    background: "white",
    padding: "8px",
    margin: "5px",
    borderRadius: "8px",
    maxWidth: "60%"
  },

  time: {
    fontSize: "10px",
    color: "gray",
    marginTop: "4px"
  },

  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc"
  },

  input: {
    flex: 1,
    padding: "8px",
    marginLeft: "10px",
    marginRight: "10px"
  },

  button: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 16px",
    cursor: "pointer"
  }
};
