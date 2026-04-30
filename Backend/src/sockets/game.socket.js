// sockets/game.socket.js
const store = require("../store/memory.store");
const checkWinner = require("../utils/checkWinner");

const gameHandler = (socket, io) => {
  socket.on("make_move", ({ roomId, index }) => {
    const room = store.rooms[roomId];
    if (!room || room.status !== "active") return;

    const player = room.players.find((p) => p.socketId === socket.id);
    if (!player || !player.turn) return;
    if (room.board[index] !== "") return;

    room.board[index] = player.symbol;

    const result = checkWinner(room.board);
    if (result !== null) {
      // result === true → someone won; result === false → draw
      clearInterval(room.timerInterval);
      const winner = result ? player : null;
      io.to(roomId).emit("game_over", {
        winner: result,
        board: room.board,
        winner_symbol: result ? player.symbol : null,
        winnername: result ? player.username : null,
        reason: result ? "win" : "draw",
      });
      if (room.code) delete store.privateCodes[room.code];
      delete store.rooms[roomId];
      return;
    }

    room.players.forEach((p) => (p.turn = !p.turn));
    io.to(roomId).emit("move_made", {
      board: room.board,
      players: room.players,
    });
  });
};

module.exports = gameHandler;