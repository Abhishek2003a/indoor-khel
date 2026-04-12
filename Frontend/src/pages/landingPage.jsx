import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <h1 className="text-5xl font-bold mb-10">🎮 Indoor Khel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Tic Tac Toe Card */}
        <div
          onClick={() => navigate("/TicTacToe")}
          className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer"
        >
          <h2 className="text-2xl font-semibold mb-2">Tic Tac Toe</h2>
          <p className="text-gray-400">Play classic 3x3 strategy game</p>
        </div>

        {/* Future Games Placeholder */}
        <div className="bg-gray-800 p-6 rounded-2xl opacity-60 cursor-not-allowed">
          <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-gray-500">More games will be added</p>
        </div>
      </div>
    </div>
  );
}
