// store/memory.store.js
module.exports = {
  rooms: {},
  publicQueue: null,        // single waiting slot for all public rooms (guests + logged-in)
  privateCodes: {},         // { [6-char code]: roomId }
  pendingReconnects: {},    // { [userId]: { roomId, timer } }
};