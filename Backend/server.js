const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const { v4 } = require("uuid");
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

function generateRoomId() {
  return v4().slice(0, 8); // 8-character unique ID
}

let waitingPlayer = null;
const rooms = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  socket.on("find_match", (data) => FindMatchHandler(data, socket));
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (waitingPlayer && waitingPlayer.socketId === socket.id) {
      waitingPlayer = null;
    }

    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (room.players.some((p) => p.socketId === socket.id)) {
        delete rooms[roomId];
        io.to(roomId).emit("opponent_left");
      }
    }
  });
});

const FindMatchHandler = async (data, socket) => {
  console.log("Received find_match from:", data.username);

  if (waitingPlayer && waitingPlayer !== socket.id) {
    console.log("Finding match for:", data.username);

    const roomId = generateRoomId();

    rooms[roomId] = {
      players: [
        waitingPlayer,
        {
          username: data.username,
          symbol: "X",
          turn: false,
          board: Array(9).fill(null),
          socketId: socket.id,
        },
      ],
    };

    socket.join(roomId);
    io.sockets.sockets.get(waitingPlayer.socketId)?.join(roomId);

    io.to(roomId).emit("match_found", {
      roomId,
      players: rooms[roomId].players,
    });
    waitingPlayer = null;
  } else {
    waitingPlayer = {
      username: data.username,
      symbol: "O",
      turn: true,
      board: Array(9).fill(null),
      socketId: socket.id,
    };
    socket.emit("waiting");
  }
};

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
