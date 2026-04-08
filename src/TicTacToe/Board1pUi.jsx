import { useState } from "react";

export default function Board1pUi() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const handleClick = (index) => {
    if (board[index]) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">{isXTurn ? "X" : "O"}'s Turn</h2>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 bg-gray-700 text-2xl font-bold rounded-xl flex items-center justify-center hover:bg-gray-600"
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
