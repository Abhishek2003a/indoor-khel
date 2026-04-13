import  {useGame} from "../../context/TicTacToe/GameContext";
import useSocket from "../../hooks/useSocket";
import Board from "../../components/TicTacToe/Board";
import Chat from "../../components/TicTacToe/Chat";

const Game = () => {
  const { board, setBoard, turn, setTurn,playerSymbol } = useGame();

  useSocket("game_update", (game) => {
    setBoard(game.board);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">

      {/* 🔝 Player Info */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
        <p className="mt-2">
          You are: <span className="font-bold">{playerSymbol}</span>
        </p>Symbol: "O",

        <p className={`mt-2 text-lg ${turn ? "text-green-400" : "text-red-400"}`}>
          {turn ? "Your Turn 🟢" : "Opponent Turn 🔴"}
        </p>
      </div>

      {/* 🔥 Main Layout */}
      <div className="flex gap-10">

        {/* 🎮 Board */}
        <Board />

        {/* 💬 Chat (optional) */}
        <Chat />

      </div>
    </div>
  );
};

export default Game;