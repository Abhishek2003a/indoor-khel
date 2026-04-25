// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const app = express();
// const { v4 } = require("uuid");
// app.use(cors());
// app.use(express.json());
// const server = http.createServer(app);

// function generateRoomId() {
//   return v4().slice(0, 8); // 8-character unique ID
// }

// let waitingPlayer = null;
// const rooms = {};

// io.on("connection", (socket) => {
//   console.log("New user connected:", socket.id);
//   socket.on("find_match", (data) => FindMatchHandler(data, socket));
//   socket.on("make_move", (data) => MakeMove(data, socket));
//   socket.on("send_message", ({ msg, roomId }) => {
//     console.log(
//       "Received send_message from:",
//       socket.id,
//       "with data:",
//       msg,
//       "roomId: ",
//       rooms[roomId]?.messages,
//       // roomId,"previous messages:", rooms[roomId]?.messages
//     );

//     if (rooms[roomId]) {
//       rooms[roomId].messages = [
//         ...(rooms[roomId].messages || []),
//         { socket: socket.id, msg: msg },
//       ];

//       io.to(roomId).emit("Message_Updated", {
//         messages: rooms[roomId].messages,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     if (waitingPlayer && waitingPlayer.socketId === socket.id) {
//       waitingPlayer = null;
//     }

//     for (const roomId in rooms) {
//       const room = rooms[roomId];
//       if (room.players.some((p) => p.socketId === socket.id)) {
//         io.to(roomId).emit("opponent_left");
//         delete rooms[roomId];
//       }
//     }
//   });
// });

// const FindMatchHandler = async (data, socket) => {
//   console.log("Received find_match from:", data.username);

//   if (waitingPlayer && waitingPlayer.socketId !== socket.id) {
//     console.log("Finding match for:", data.username);

//     const roomId = generateRoomId();

//     rooms[roomId] = {
//       board: Array(9).fill(""),
//       messages: [],
//       players: [
//         waitingPlayer,
//         {
//           username: data.username,
//           symbol: "X",
//           turn: false,
//           socketId: socket.id,
//         },
//       ],
//     };

//     socket.join(roomId);
//     io.sockets.sockets.get(waitingPlayer.socketId)?.join(roomId);

//     io.to(roomId).emit("match_found", {
//       roomId,
//       players: rooms[roomId].players,
//       board: rooms[roomId].board,
//     });
//     waitingPlayer = null;
//   } else {
//     waitingPlayer = {
//       username: data.username,
//       symbol: "O",
//       turn: true,
//       socketId: socket.id,
//     };
//     socket.emit("waiting");
//   }
// };

// const MakeMove = (data, socket) => {
//   console.log("Received make_move from:", socket.id, "with data:", data);
//   const { roomId, index } = data;
//   const room = rooms[roomId];
//   if (!room) return;

//   const player = room.players.find((p) => p.socketId === socket.id);
//   if (!player || !player.turn) return;

//   if (room.board[index] !== "") return;

//   room.board[index] = player.symbol;
//   const winner = checkWinner(room.board);
//   if (winner != null) {
//     io.to(roomId).emit("game_over", {
//       winner: winner,
//       board: room.board,
//       winner_symbol: player.symbol,
//       winnername:
//         player.symbol === room.players[0].symbol
//           ? room.players[0].username
//           : room.players[1].username,
//     });
//     delete rooms[roomId];
//     waitingPlayer = null;
//     return;
//   } else {
//     room.players.forEach((p) => (p.turn = !p.turn));
//     console.log("Emitting move_made for roomId: " + roomId);
//     io.to(roomId).emit("move_made", {
//       board: room.board,
//       players: room.players,
//     });
//   }
// };



// server.listen(3000, () => {
//   console.log("Server running on port 3000");
// });


const express = require("express");
const http = require("http");
const cors = require("cors");
const setupSocket = require("./config/socket");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

setupSocket(server);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});