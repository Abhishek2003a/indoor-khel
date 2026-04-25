const { Server } = require("socket.io");
const initSockets = require("../sockets");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  initSockets(io);
};

module.exports = setupSocket;