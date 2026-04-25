// sockets/index.js
const chatHandler = require("./chat.socket");
const gameHandler = require("./game.socket");
const matchHandler = require("./match.socket");

const initSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    matchHandler(socket, io);
    gameHandler(socket, io);
    chatHandler(socket, io);
  });
};

module.exports = initSockets;