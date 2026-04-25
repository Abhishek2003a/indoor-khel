import React from "react";
import { useGame } from "../../context/TicTacToe/GameContext";
const WinnerCard = ({ onRestart }) => {
  const { winner, playerSymbol, username, winnerName, winnerSymbol } = useGame();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
        {/* Title */}
        <h2 className="text-2xl text-black-600 font-bold mb-4 ">
          {!winner ? "It's a Draw 😐" : `🎉 Player ${winnerName} Wins!`}
        </h2>

        {/* Status */}
        {winner && (
          <p className="text-gray-600 mb-4">
            {winnerSymbol === playerSymbol
              ? "You won the game! 🏆"
              : "You lost the game 😢"}
          </p>
        )}

       {/* Button */}
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerCard;
