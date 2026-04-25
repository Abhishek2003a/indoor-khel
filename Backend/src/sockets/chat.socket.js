// sockets/chat.socket.js
const { rooms } = require("../store/memory.store");

const chatHandler = (socket, io) => {

  socket.on("send_message", ({ msg, roomId }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].messages.push({
      socket: socket.id,
      msg,
    });

    io.to(roomId).emit("Message_Updated", {
      messages: rooms[roomId].messages,
    });
  });

};

module.exports = chatHandler;