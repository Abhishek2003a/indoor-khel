import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/TicTacToe/GameContext";
import useSocket from "../../hooks/useSocket";
import Board from "../../components/TicTacToe/Board";
import Chat from "../../components/TicTacToe/Chat";
import WinnerCard from "../../components/TicTacToe/WinnerCard";
import { socket } from "../../services/socket";

const formatTime = (secs) => {
  if (secs == null) return null;
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const Game = () => {
  const navigate = useNavigate();
  const {
    board, setBoard, turn, setTurn,
    playerSymbol, setPlayerSymbol, username, opponentName, setOpponentName,
    opponentSymbol, setOpponentSymbol,
    setMessages, winner, setWinner, setWinnerName, setWinnerSymbol, setWinnerReason,
    roomId, setRoomId, timeLeft, setTimeLeft, setSearching,
  } = useGame();

  const [disconnectGrace, setDisconnectGrace] = useState(null); // { username, grace }
  const [graceCountdown, setGraceCountdown] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  // ── Socket listeners ──────────────────────────────────────────────────────

  useSocket("move_made", (game) => {
    setBoard(game.board);
    const me = game.players.find((p) => p.socketId === socket.id);
    setTurn(me ? me.turn : false);
  });

  useSocket("timer_tick", ({ timeLeft: t }) => {
    setTimeLeft(t);
  });

  useSocket("game_over", ({ winner, board, winner_symbol, winnername, reason }) => {
    setWinner(winner);
    setWinnerName(winnername);
    setBoard(board);
    setWinnerSymbol(winner_symbol);
    setWinnerReason(reason);
    setTurn(false);
    setDisconnectGrace(null);
    setGraceCountdown(null);
  });

  useSocket("opponent_disconnected", ({ grace, username: oppName }) => {
    setDisconnectGrace({ username: oppName, grace });
    setGraceCountdown(grace);
    const interval = setInterval(() => {
      setGraceCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  });

  useSocket("player_reconnected", () => {
    setDisconnectGrace(null);
    setGraceCountdown(null);
  });

  useSocket("game_restored", (data) => {
    setBoard(data.board);
    setTimeLeft(data.timeLeft);
    setDisconnectGrace(null);
    setGraceCountdown(null);
  });

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleLeave = () => {
    socket.emit("leave_room", { roomId });
    navigate("/tictactoe/Home");
  };

  const handleRestart = () => {
    // Clear all game state so the next match starts fresh
    setBoard(Array(9).fill(""));
    setWinner(null);
    setWinnerName(null);
    setWinnerSymbol(null);
    setWinnerReason(null);
    setMessages([]);
    setTimeLeft(null);
    setRoomId(null);
    setPlayerSymbol(null);
    setOpponentName("");
    setOpponentSymbol(null);
    setTurn(false);
    setSearching(false);
    navigate("/tictactoe/Home");
  };

  const timerDisplay = formatTime(timeLeft);
  const timerDanger = timeLeft != null && timeLeft <= 10;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative">
      {/* Header row */}
      <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
        <h1 className="text-2xl font-bold">Tic Tac Toe</h1>

        {/* Timer */}
        {timerDisplay && (
          <div className={`text-2xl font-mono font-bold px-4 py-1 rounded-xl ${
            timerDanger ? "bg-red-700 animate-pulse" : "bg-gray-800"
          }`}>
            {timerDisplay}
          </div>
        )}

        {/* Leave button */}
        {winner === null && (
          <button
            onClick={() => setConfirmLeave(true)}
            className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-sm font-semibold transition"
          >
            Leave
          </button>
        )}
      </div>

      {/* Opponent disconnected overlay */}
      {disconnectGrace && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="text-4xl mb-3">📡</div>
            <h2 className="text-xl font-bold mb-2">{disconnectGrace.username} disconnected</h2>
            <p className="text-gray-400 mb-4">
              Waiting for reconnection… <span className="text-white font-bold">{graceCountdown}s</span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(graceCountdown / disconnectGrace.grace) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm leave dialog */}
      {confirmLeave && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-xs mx-4">
            <h2 className="text-xl font-bold mb-2">Leave game?</h2>
            <p className="text-gray-400 mb-6">Your opponent will be declared the winner.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLeave(false)}
                className="flex-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Stay
              </button>
              <button
                onClick={handleLeave}
                className="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-600 transition font-semibold"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {winner !== null ? (
        <WinnerCard onRestart={handleRestart} />
      ) : (
        <div className="flex gap-10 items-start">
          <div className="relative mt-10">
            {/* Player labels */}
            <div className={`absolute -top-10 left-0 text-sm flex items-center gap-2 px-3 py-1 rounded-md ${
              turn ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300"
            }`}>
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black font-bold">
                {playerSymbol || "?"}
              </div>
              <div className="font-medium">{username || "You"}</div>
            </div>

            <div className={`absolute -top-10 right-0 text-sm flex items-center gap-2 px-3 py-1 rounded-md ${
              !turn ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300"
            }`}>
              <div className="font-medium">{opponentName || "Opponent"}</div>
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-black font-bold">
                {opponentSymbol || "?"}
              </div>
            </div>

            <Board />
          </div>
          <Chat />
        </div>
      )}
    </div>
  );
};

export default Game;
