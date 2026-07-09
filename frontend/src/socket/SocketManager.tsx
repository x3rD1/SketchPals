import { useEffect } from "react";
import useAuth from "../features/auth/hook/useAuth";
import { socket } from "./socket";

function SocketManager() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      socket.disconnect();
      return;
    }

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  return null;
}

export default SocketManager;
