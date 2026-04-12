import { useState } from "react";
import { useGame } from "../../context/TicTacToe/GameContext";
import { useNavigate } from "react-router-dom";

const Entry = () => {
  const [name, setName] = useState("");
  const { setUsername } = useGame();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!name.trim()) {
      alert("Please enter a username");
      return;
    }
    setUsername(name);
    navigate("./Home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          Enter Username 🎮
        </h2>

        <input
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg outline-none bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          onClick={handleContinue}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Continue 🚀
        </button>
      </div>
    </div>
  );
};

export default Entry;
