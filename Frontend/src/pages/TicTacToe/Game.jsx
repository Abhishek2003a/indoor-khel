import { useGame } from "../../context/TicTacToe/GameContext";
import useSocket from "../../hooks/useSocket";
import Board from "../../components/TicTacToe/Board";
import Chat from "../../components/TicTacToe/Chat";
import { socket } from "../../services/socket";
import { use } from "react";
import PlayAgain from "../../components/TicTacToe/PlayAgain";

const Game = () => {
  const {
    setBoard,
    turn,
    setTurn,
    playerSymbol,
    username,
    messages,
    setMessages,
    playAgain,
    setPlayAgain,
  } = useGame();

  useSocket("move_made", (game) => {
    console.log("Received move_made:", game);
    setBoard(game.board);
    if (game.players.find((p) => p.socketId === socket.id).turn === true) {
      setTurn(true);
    } else {
      setTurn(false);
    }
  });

  useSocket("game_over", ({ winner, board, symbol }) => {
    if (winner)
      alert(
        `Game Over! Winner: ${playerSymbol === symbol ? "You" : "Opponent"}`,
      );
    else {
      alert("Game Over! It's a draw!");
      setPlayAgain(true);
    }
    setBoard(board);
    setTurn(false);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* 🔝 Player Info */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
        <p className="mt-2">
          You are: <span className="font-bold">{playerSymbol}</span>
        </p>
        Symbol: "O",
        <p
          className={`mt-2 text-lg ${turn ? "text-green-400" : "text-red-400"}`}
        >
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
      {playAgain && <PlayAgain />}
    </div>
  );
};

export default Game;
