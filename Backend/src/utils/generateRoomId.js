// utils/generateRoomId.js
const { v4 } = require("uuid");

function generateRoomId() {
  return v4().slice(0, 8);
}

function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

module.exports = generateRoomId;
module.exports.generateRoomCode = generateRoomCode;