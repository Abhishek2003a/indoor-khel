import { useState } from "react";

export default function BoardUI() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const playerX = "Player X";
  const playerO = "Player O";

  const handleClick = (index) => {
    if (board[index]) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white px-6">
      {/* MAIN CONTAINER */}
      <div className="flex gap-10">
        {/* LEFT SIDE -> GAME */}
        <div className="flex flex-col items-center">
          {/* PLAYER HEADER */}
          <div className="w-full flex justify-between mb-4 text-lg font-semibold">
            {/* Player X */}
            <div
              className={`px-4 py-2 rounded-xl ${
                isXTurn ? "bg-green-500 text-black" : "bg-gray-700"
              }`}
            >
              {playerX} (X)
            </div>

            {/* Player O */}
            <div
              className={`px-4 py-2 rounded-xl ${
                !isXTurn ? "bg-green-500 text-black" : "bg-gray-700"
              }`}
            >
              {playerO} (O)
            </div>
          </div>

          {/* BOARD */}
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                className="w-24 h-24 bg-gray-800 text-3xl font-bold rounded-2xl flex items-center justify-center hover:bg-gray-700 transition"
              >
                {cell}
              </button>
            ))}
          </div>

          {/* RESTART BUTTON */}
          <button
            onClick={resetGame}
            className="mt-6 px-6 py-3 bg-blue-500 rounded-2xl shadow-lg hover:bg-blue-600 transition"
          >
            Restart Game
          </button>
        </div>

        {/* RIGHT SIDE -> CHAT */}
        <div className="w-72 bg-gray-800 p-4 rounded-2xl flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Chat Room</h2>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto bg-gray-700 p-3 rounded-lg mb-3">
            {/* Messages here */}
          </div>

          {/* INPUT */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type message..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-600 outline-none"
            />
            <button className="px-3 py-2 bg-green-500 rounded-lg hover:bg-green-600">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
