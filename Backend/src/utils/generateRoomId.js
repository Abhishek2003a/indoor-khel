// utils/generateRoomId.js
const { v4 } = require("uuid");

function generateRoomId() {
  return v4().slice(0, 8);
}

module.exports = generateRoomId;