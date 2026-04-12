const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let waitingPlayer = null;
const rooms = {};

socket.on("find_match", (data) => {
  if (waitingPlayer && waitingPlayer !== socket.id) {
    const roomId = generateRoomId();
    rooms[roomId] = {
      players: [
        waitingPlayer,
        { socketId: socket.id, username: data.username },
      ],
    };
    io.sockets.sockets.get(waitingPlayer)?.join(roomId);
    socket.join(roomId);
    io.to(roomId).emit("match_found", {
      roomId,
      players: rooms[roomId].players,
    });
    waitingPlayer = null;
  } else {
    waitingPlayer = { socketId: socket.id, username: data.username };
    socket.emit("waiting");
  }
});

// socket.on("play", () => {
//   // agar koi already wait kar raha hai
//   if (waitingPlayer && waitingPlayer !== socket.id) {
//     const roomId = generateRoomId();

//     rooms[roomId] = {
//       players: [waitingPlayer, socket.id],
//       board: Array(9).fill(null),
//       turn: "X",
//     };

//     // dono sockets ko room me daalo
//     io.sockets.sockets.get(waitingPlayer)?.join(roomId);
//     socket.join(roomId);

//     // game start
//     io.to(roomId).emit("start_game", rooms[roomId]);

//     waitingPlayer = null; // reset queue
//   } else {
//     // koi wait nahi kar raha → isko waiting me daal do
//     waitingPlayer = socket.id;

//     socket.emit("waiting");
//   }
// });

socket.on("disconnect", () => {
  if (waitingPlayer === socket.id) {
    waitingPlayer = null;
  }

  // rooms cleanup (same as before)
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

socket.on("create_room", () => {
  const roomId = generateRoomId();
  rooms[roomId] = {
    players: [socket.id],
    board: Array(9).fill(null),
    turn: "X",
  };

  socket.join(roomId);

  socket.emit("room_created", roomId);
});
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
