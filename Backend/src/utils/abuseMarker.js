const { trieBuild } = require("../utils/buildTrie");

function markAbuse(message) {
  const msg = message.toLowerCase().split(" ");
  let newMsg = "";
  for (let word of msg) {
    if (trieBuild.search(word)) {
      newMsg += word[0] + "*".repeat(word.length - 1) + " ";
    } else newMsg += word + " ";
  }
  return newMsg.trim();
}
module.exports = markAbuse;
