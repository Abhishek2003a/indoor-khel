// sockets/match.socket.js — unified public matchmaking for guests and logged-in users
const generateRoomId = require("../utils/generateRoomId");
const store = require("../store/memory.store");

const PUBLIC_DURATION = 120; // 2 minutes, fixed for all public rooms

function isAlreadyPlaying(socketId) {
  if (store.publicQueue?.socketId === socketId) return true;
  return Object.values(store.rooms).some((room) =>
    room.players.some((p) => p.socketId === socketId)
  );
}

function startTimer(room, roomId, io) {
  room.timerInterval = setInterval(() => {
    const current = store.rooms[roomId];
    if (!current) { clearInterval(room.timerInterval); return; }
    current.timeLeft--;
    io.to(roomId).emit("timer_tick", { timeLeft: current.timeLeft });

    if (current.timeLeft <= 0) {
      clearInterval(current.timerInterval);
      io.to(roomId).emit("game_over", {
        winner: false,
        winnername: null,
        winner_symbol: null,
        board: current.board,
        reason: "timeout",
      });
      delete store.rooms[roomId];
    }
  }, 1000);
}

const handleMatch = (socket, io) => {
  // ── find_match ────────────────────────────────────────────────────────────
  // Used by both guest and logged-in users for public rooms.
  socket.on("find_match", ({ username }) => {
    if (isAlreadyPlaying(socket.id)) {
      return socket.emit("match_error", {
        message: "You are already in a match. Please finish or leave the current game first.",
      });
    }

    const userId = socket.user?.userId || null;
    const queued = store.publicQueue;

    if (queued && queued.socketId !== socket.id) {
      // Match found — pair with the waiting player
      const roomId = generateRoomId();
      const room = {
        type: "public",
        duration: PUBLIC_DURATION,
        timeLeft: PUBLIC_DURATION,
        status: "active",
        board: Array(9).fill(""),
        messages: [],
        timerInterval: null,
        players: [
          queued,
          {
            username: username || "Guest",
            symbol: "X",
            turn: false,
            socketId: socket.id,
            userId,
          },
        ],
      };
      store.rooms[roomId] = room;
      store.publicQueue = null;

      io.sockets.sockets.get(queued.socketId)?.join(roomId);
      socket.join(roomId);

      startTimer(room, roomId, io);

      // Small delay so both clients are ready before match_found fires
      setTimeout(() => {
        io.to(roomId).emit("match_found", {
          roomId,
          players: room.players,
          board: room.board,
          messages: room.messages,
          duration: room.duration,
        });
      }, 500);
    } else {
      // No waiting player — add this socket to the queue
      store.publicQueue = {
        username: username || "Guest",
        symbol: "O",
        turn: true,
        socketId: socket.id,
        userId,
      };
      socket.emit("waiting");
    }
  });

  // ── cancel_match ─────────────────────────────────────────────────────────
  socket.on("cancel_match", () => {
    if (store.publicQueue?.socketId === socket.id) {
      store.publicQueue = null;
    }
  });

  // ── disconnect ────────────────────────────────────────────────────────────
  // Only handles queue cleanup. Active room disconnects are handled by
  // room.socket.js which checks player.userId for grace period eligibility.
  socket.on("disconnect", () => {
    if (store.publicQueue?.socketId === socket.id) {
      store.publicQueue = null;
    }
  });
};

module.exports = handleMatch;
