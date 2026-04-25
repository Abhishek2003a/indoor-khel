// sockets/match.socket.js
const generateRoomId = require("../utils/generateRoomId");
const { rooms } = require("../store/memory.store");
let { waitingPlayer } = require("../store/memory.store");

const handleMatch = (socket, io) => {
  socket.on("find_match", (data) => {
    if (waitingPlayer && waitingPlayer.socketId !== socket.id) {
      const roomId = generateRoomId();

      rooms[roomId] = {
        board: Array(9).fill(""),
        messages: [],
        players: [
          waitingPlayer,
          {
            username: data.username,
            symbol: "X",
            turn: false,
            socketId: socket.id,
          },
        ],
      };

      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer.socketId)?.join(roomId);

      io.to(roomId).emit("match_found", {
        roomId,
        players: rooms[roomId].players,
        board: rooms[roomId].board,
      });

      waitingPlayer = null;
    } else {
      waitingPlayer = {
        username: data.username,
        symbol: "O",
        turn: true,
        socketId: socket.id,
      };

      socket.emit("waiting");
    }
  });
};

module.exports = handleMatch;
