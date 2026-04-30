// sockets/index.js
const jwt = require("jsonwebtoken");
const chatHandler = require("./chat.socket");
const gameHandler = require("./game.socket");
const matchHandler = require("./match.socket");
const roomHandler = require("./room.socket");

const initSockets = (io) => {
  // JWT auth middleware — allows guests (no token) but attaches user if valid token provided
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.user = null; // guest
      return next();
    }
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      socket.user = null; // treat expired/invalid tokens as guest
      next();
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} | user: ${socket.user?.userId || "guest"}`);

    roomHandler(socket, io);  // authenticated room creation/join/leave
    matchHandler(socket, io); // guest public matchmaking (find_match)
    gameHandler(socket, io);  // move handling (shared)
    chatHandler(socket, io);  // chat (shared)
  });
};

module.exports = initSockets;