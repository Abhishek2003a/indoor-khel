// sockets/room.socket.js
const store = require("../store/memory.store");
const generateRoomId = require("../utils/generateRoomId");
const { generateRoomCode } = require("../utils/generateRoomId");
const checkWinner = require("../utils/checkWinner");

const VALID_PRIVATE_DURATIONS = [60, 180, 300];
const GRACE_SECONDS = 12;

function isAlreadyPlaying(socketId) {
  if (store.publicQueue?.socketId === socketId) return true;
  return Object.values(store.rooms).some((room) =>
    room.players.some((p) => p.socketId === socketId)
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function startTimer(room, roomId, io) {
  room.timerInterval = setInterval(() => {
    const current = store.rooms[roomId];
    if (!current || current.status !== "active") {
      clearInterval(room.timerInterval);
      return;
    }
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
      cleanupRoom(roomId);
    }
  }, 1000);
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

function cleanupRoom(roomId) {
  const room = store.rooms[roomId];
  if (!room) return;
  clearInterval(room.timerInterval);
  if (room.type === "public" && store.publicQueue?.id === roomId) {
    store.publicQueue = null;
  }
  if (room.code) delete store.privateCodes[room.code];
  delete store.rooms[roomId];
}

function endGame(io, roomId, winner, reason) {
  const room = store.rooms[roomId];
  if (!room) return;
  clearInterval(room.timerInterval);
  io.to(roomId).emit("game_over", {
    winner: !!winner,
    winnername: winner?.username || null,
    winner_symbol: winner?.symbol || null,
    board: room.board,
    reason,
  });
  cleanupRoom(roomId);
}

// ─── Handler ──────────────────────────────────────────────────────────────────

const roomHandler = (socket, io) => {
  // ── Reconnection check on every new connection ──────────────────────────────
  if (socket.user) {
    const pending = store.pendingReconnects[socket.user.userId];
    if (pending) {
      const room = store.rooms[pending.roomId];
      if (room) {
        const player = room.players.find((p) => p.userId === socket.user.userId);
        if (player) {
          player.socketId = socket.id;
          room.status = "active";
          socket.join(pending.roomId);
          clearTimeout(pending.timer);
          delete store.pendingReconnects[socket.user.userId];

          socket.emit("game_restored", {
            roomId: pending.roomId,
            board: room.board,
            players: room.players,
            messages: room.messages,
            timeLeft: room.timeLeft,
            duration: room.duration,
          });
          socket.to(pending.roomId).emit("player_reconnected", {
            username: player.username,
          });
          return;
        }
      }
      delete store.pendingReconnects[socket.user.userId];
    }
  }

  // ── create_room (private only) ───────────────────────────────────────────
  // Public matchmaking uses find_match in match.socket.js for both guests and
  // logged-in users so they share the same queue.
  socket.on("create_room", ({ duration, username }) => {
    if (!socket.user) {
      return socket.emit("room_error", { message: "Login required to create a private room" });
    }
    if (isAlreadyPlaying(socket.id)) {
      return socket.emit("room_error", {
        message: "You are already in a match. Please finish or leave the current game first.",
      });
    }
    const dur = Number(duration);
    if (!VALID_PRIVATE_DURATIONS.includes(dur)) {
      return socket.emit("room_error", { message: "Invalid duration" });
    }

    const roomId = generateRoomId();
    const code = generateRoomCode();
    const room = {
      id: roomId,
      code,
      type: "private",
      duration: dur,
      timeLeft: dur,
      status: "waiting",
      board: Array(9).fill(""),
      messages: [],
      timerInterval: null,
      players: [{
        socketId: socket.id,
        userId: socket.user.userId,
        username: username || "Player",
        symbol: "O",
        turn: true,
      }],
    };
    store.rooms[roomId] = room;
    store.privateCodes[code] = roomId;
    socket.join(roomId);
    socket.emit("room_created", { roomId, code, type: "private", duration: dur, status: "waiting" });
  });

  // ── join_room ────────────────────────────────────────────────────────────────
  socket.on("join_room", ({ code, username }) => {
    if (!socket.user) {
      return socket.emit("join_error", { message: "Login required to join a room" });
    }
    if (isAlreadyPlaying(socket.id)) {
      return socket.emit("join_error", {
        message: "You are already in a match. Please finish or leave the current game first.",
      });
    }
    const upperCode = (code || "").toUpperCase().trim();
    const roomId = store.privateCodes[upperCode];
    if (!roomId) return socket.emit("join_error", { message: "Invalid room code" });

    const room = store.rooms[roomId];
    if (!room) return socket.emit("join_error", { message: "Invalid room code" });
    if (room.status !== "waiting") return socket.emit("join_error", { message: "Room is no longer available" });
    if (room.players.length >= 2) return socket.emit("join_error", { message: "Room is full" });
    if (room.players[0].socketId === socket.id) {
      return socket.emit("join_error", { message: "You created this room" });
    }

    const joiner = {
      socketId: socket.id,
      userId: socket.user?.userId || null,
      username: username || "Player",
      symbol: "X",
      turn: false,
    };
    room.players.push(joiner);
    room.status = "active";
    socket.join(roomId);
    startTimer(room, roomId, io);

    io.to(roomId).emit("match_found", {
      roomId,
      players: room.players,
      board: room.board,
      messages: room.messages,
      duration: room.duration,
    });
  });

  // ── leave_room ───────────────────────────────────────────────────────────────
  socket.on("leave_room", ({ roomId }) => {
    const room = store.rooms[roomId];
    if (!room) return;
    const playerIdx = room.players.findIndex((p) => p.socketId === socket.id);
    if (playerIdx === -1) return;
    const opponent = room.players[1 - playerIdx];
    endGame(io, roomId, opponent || null, "forfeit");
  });

  // ── disconnect ───────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    // Find any active room this socket belongs to
    for (const [roomId, room] of Object.entries(store.rooms)) {
      const playerIdx = room.players.findIndex((p) => p.socketId === socket.id);
      if (playerIdx === -1) continue;

      const player = room.players[playerIdx];
      const opponent = room.players[1 - playerIdx];

      if (room.status === "waiting") {
        // No game started yet — just clean up
        cleanupRoom(roomId);
        break;
      }

      if (room.status === "active" && player.userId) {
        // Authenticated player — offer grace period
        room.status = "grace";
        clearInterval(room.timerInterval);
        io.to(roomId).emit("opponent_disconnected", { grace: GRACE_SECONDS, username: player.username });

        const timer = setTimeout(() => {
          if (store.rooms[roomId]) {
            endGame(io, roomId, opponent || null, "disconnect");
          }
          delete store.pendingReconnects[player.userId];
        }, GRACE_SECONDS * 1000);

        store.pendingReconnects[player.userId] = { roomId, timer };
      } else if (room.status === "active") {
        // Guest — immediate forfeit
        endGame(io, roomId, opponent || null, "disconnect");
      }
      break;
    }
  });
};

module.exports = roomHandler;
