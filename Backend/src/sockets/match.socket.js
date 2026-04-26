// sockets/match.socket.js
const generateRoomId = require("../utils/generateRoomId");
const store = require("../store/memory.store");
// let { waitingPlayer } = require("../store/memory.store");

const handleMatch = (socket, io) => {
  socket.on("find_match", (data) => {
    console.log("Received find_match from", data.username);
    if (store.waitingPlayer && store.waitingPlayer.socketId !== socket.id) {
      console.log("Match found! Creating room...");
      const roomId = generateRoomId();
      console.log("room Id Generated -> ", roomId);
      store.rooms[roomId] = {
        board: Array(9).fill(""),
        messages: [],
        players: [
          store.waitingPlayer,
          {
            username: data.username,
            symbol: "X",
            turn: false,
            socketId: socket.id,
          },
        ],
      };
      console.log("Room created with players:", store.rooms[roomId].players);

      // socket.join(roomId);
      io.sockets.sockets
        .get(store.rooms[roomId].players[0].socketId)
        ?.join(roomId);
      io.sockets.sockets
        .get(store.rooms[roomId].players[1].socketId)
        ?.join(roomId);
      console.log("Players joined room:", roomId);
      setTimeout(() => {
        io.to(roomId).emit("match_found", {
          roomId,
          players: store.rooms[roomId].players,
          board: store.rooms[roomId].board,
          messages: store.rooms[roomId].messages,
        });
      }, 1000);
      console.log("Emitted match_found to room:", roomId);
      store.waitingPlayer = null;
    } else {
      console.log(
        "No waiting player. Setting",
        data.username,
        "as waiting player.",
      );
      store.waitingPlayer = {
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
