import { useEffect } from "react";
import { socket } from "../services/socket";

const useSocket = (event, handler) => {
  useEffect(() => {
    socket.on(event, handler);

    return () => {
      socket.off(event, handler); // cleanup 🔥
    };
  }, [event, handler]);
};

export default useSocket;
