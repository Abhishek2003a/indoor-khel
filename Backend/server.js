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
  socket.on("make_move", (data) => MakeMove(data, socket));

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
      board: Array(9).fill(""),
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
};

const MakeMove = (data, socket) => {
  console.log("Received make_move from:", socket.id, "with data:", data);
  const { roomId, index } = data;
  const room = rooms[roomId];
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player || !player.turn) return;

  if (room.board[index] !== "") return;

  room.board[index] = player.symbol;
  const winner = checkWinner(room.board);
  if (winner != null) {
    io.to(roomId).emit("game_over", { winner: winner, board: room.board });
    delete rooms[roomId];
    return;
  } else {
    room.players.forEach((p) => (p.turn = !p.turn));
    console.log("Emitting move_made for roomId: " + roomId);
    io.to(roomId).emit("move_made", {
      board: room.board,
      players: room.players,
    });
  }
};

const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let flag = false;
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
    if (board[a] == "" || board[b] == "" || board[c] == "") {
      flag = true;
    }
  }

  return flag ? null : false;
};

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
