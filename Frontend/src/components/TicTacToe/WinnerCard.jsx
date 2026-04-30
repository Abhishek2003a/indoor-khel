import { useGame } from "../../context/TicTacToe/GameContext";

const REASON_LABELS = {
  forfeit: "Opponent quit the game",
  disconnect: "Opponent lost connection",
  timeout: "Time's up!",
  win: null,
  draw: null,
};

const WinnerCard = ({ onRestart }) => {
  const { winner, playerSymbol, winnerName, winnerSymbol, winnerReason } = useGame();

  const isWinner = winner && winnerSymbol === playerSymbol;
  const isDraw = !winner;

  const title = isDraw ? "It's a Draw! 😐" : `${winnerName} Wins! 🎉`;
  const subtitle = isDraw
    ? "Well played by both!"
    : isWinner
    ? "You won the game! 🏆"
    : "You lost the game 😢";
  const reasonLabel = winnerReason ? REASON_LABELS[winnerReason] : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 w-80 text-center text-white">
        <div className="text-5xl mb-3">{isDraw ? "🤝" : isWinner ? "🏆" : "😢"}</div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-gray-400 mb-1 text-sm">{subtitle}</p>
        {reasonLabel && (
          <p className="text-gray-500 text-xs mb-4">{reasonLabel}</p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onRestart}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold transition"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;
