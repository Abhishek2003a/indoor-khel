// sockets/game.socket.js
const { rooms } = require("../store/memory.store");
const checkWinner = require("../utils/checkWinner");

const gameHandler = (socket, io) => {
  console.log("Game handler initialized for socket:", socket.id);
  socket.on("make_move", ({ roomId, index }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || !player.turn) return;

    if (room.board[index] !== "") return;

    room.board[index] = player.symbol;

    // winner logic yaha call karega
    const winner = checkWinner(room.board);
    if (winner != null) {
      io.to(roomId).emit("game_over", {
        winner: winner,
        board: room.board,
        winner_symbol: player.symbol,
        winnername: player.symbol === room.players[0].symbol ? room.players[0].username : room.players[1].username,
      });
      delete rooms[roomId];
      waitingPlayer = null;
      return;
    } else {
      room.players.forEach(p => p.turn = !p.turn);
    }
    io.to(roomId).emit("move_made", {
      board: room.board,
      players: room.players,
    });
  });

};

module.exports = gameHandler;