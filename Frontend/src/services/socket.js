import { io } from "socket.io-client";

const getStoredToken = () => {
  try {
    return JSON.parse(localStorage.getItem("auth") || "{}").accessToken || null;
  } catch {
    return null;
  }
};

export const socket = io("http://localhost:3000", {
  auth: { token: getStoredToken() },
});

// Call after login or logout to re-authenticate the socket connection
export const reconnectSocket = (token) => {
  socket.auth = { token: token || null };
  socket.disconnect().connect();
};
