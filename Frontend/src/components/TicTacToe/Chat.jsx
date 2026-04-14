import { useState, useEffect, useRef } from "react";
import { socket } from "../../services/socket";
import { useGame } from "../../context/TicTacToe/GameContext";
const Chat = () => {
  const [msg, setMsg] = useState("");
  const { messages, setMessages, roomId } = useGame();

  const sendMessage = () => {
    if (!msg) return;
    console.log(msg);
    console.log(
      "Emitting send_message from:",
      socket.id,
      "with messages:",
      [...messages, msg],
      "and roomId:",
      roomId,
    );
    socket.emit("send_message", { msg, roomId });
    setMsg("");
  };

  const chatRef = useRef(null);
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="w-64 bg-gray-800 p-4 rounded-xl">
      <div ref={chatRef} className="h-64 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // new line ko rokta hai
            if (msg.trim() !== "") {
              sendMessage();
            }
          }
        }}
        className="w-full p-1 text-black"
      />

      <button onClick={sendMessage} className="mt-2 w-full bg-blue-500 p-1">
        Send
      </button>
    </div>
  );
};

export default Chat;
