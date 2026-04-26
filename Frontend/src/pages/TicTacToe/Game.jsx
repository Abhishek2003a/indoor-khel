import { useGame } from "../../context/TicTacToe/GameContext";
import useSocket from "../../hooks/useSocket";
import Board from "../../components/TicTacToe/Board";
import Chat from "../../components/TicTacToe/Chat";
import { socket } from "../../services/socket";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import WinnerCard from "../../components/TicTacToe/WinnerCard";
import { useState } from "react";

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
    winner,
    setWinner,
    winnerName,
    setWinnerName,
    searching,
    setSearching,
    winnerSymbol,
    setWinnerSymbol,
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
  useSocket("game_over", ({ winner, board, winner_symbol, winnername }) => {
    setWinner(winner);
    setWinnerName(winnername);
    setBoard(board);
    setWinnerSymbol(winner_symbol);
    setTurn(false);
  });

  const Navigate = useNavigate();
  const handleRestart = () => {
    console.log("Restarting game...");
    socket.emit("find_match", { username });
    setSearching(true);
    Navigate("../TicTacToe/Home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
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
      {winner ? (
        <WinnerCard onRestart={handleRestart} />
      ) : (
        <div className="flex gap-10">
          {/* 🎮 Board */}
          <Board />
          {/* 💬 Chat (optional) */}
          <Chat />
        </div>
      )}
    </div>
  );
};

export default Game;
