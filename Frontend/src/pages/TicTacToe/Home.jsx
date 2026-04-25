import { socket } from "../../services/socket";
import { useGame } from "../../context/TicTacToe/GameContext";
import { useNavigate } from "react-router-dom";
import useSocket from "../../hooks/useSocket";
import { useState } from "react";

const Home = () => {
  const {
    username,
    setRoomId,
    setPlayerSymbol,
    setBoard,
    setUsername,
    setWinner,
    setTurn,
    searching,
    setSearching,
  } = useGame();
  const navigate = useNavigate();
  const handleStart = () => {
    setSearching(true);
    console.log("Emitting find_match for username:", username);
    setUsername(username);
    socket.emit("find_match", { username });
  };

  useSocket("match_found", (data) => {
    setRoomId(data.roomId);
    console.log("Match found:", data);

    const me = data.players.find((p) => p.socketId === socket.id);
    setPlayerSymbol(me.symbol);
    setTurn(me.turn);
    setWinner(null);
    setBoard(data.board);
    console.log("All Set! Navigating to game with roomId:", data.roomId);
    setSearching(false);
    navigate("/TicTacToe/Game");
  });

  return (
    <div className="h-screen items-center justify-center bg-gray-900 text-white">
      <h1 className="p-4 text-4xl font-bold mb-6">Welcome {username}</h1>
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        {!searching ? (
          <button
            onClick={handleStart}
            className="bg-green-500 px-6 py-3 rounded-xl"
          >
            Start Playing
          </button>
        ) : (
          <div className="text-center">
            <h2 className="text-xl">Finding Opponent...</h2>
            <div className="mt-4 animate-pulse">⏳</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
