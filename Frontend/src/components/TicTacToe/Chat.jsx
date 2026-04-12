import { useState } from "react";

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!msg) return;

    setMessages([...messages, msg]);
    setMsg("");
  };

  return (
    <div className="w-64 bg-gray-800 p-4 rounded-xl">

      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="w-full p-1 text-black"
      />

      <button onClick={sendMessage} className="mt-2 w-full bg-blue-500 p-1">
        Send
      </button>
    </div>
  );
};

export default Chat;