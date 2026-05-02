// sockets/chat.socket.js
const { rooms } = require("../store/memory.store");
const markAbuse = require("../utils/abuseMarker");
const chatHandler = (socket, io) => {
  socket.on("send_message", ({ msg, roomId }) => {
    if (!rooms[roomId]) return;

    const cleanMsg = markAbuse(msg);
    console.log(cleanMsg);
    rooms[roomId].messages.push({
      socket: socket.id,
      msg: cleanMsg,
    });

    io.to(roomId).emit("Message_Updated", {
      messages: rooms[roomId].messages,
    });
  });
};

module.exports = chatHandler;
