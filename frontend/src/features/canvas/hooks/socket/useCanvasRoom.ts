import { useEffect } from "react";
import toast from "react-hot-toast";
import { socket } from "../../../../socket/socket";

type JoinCanvasAck = {
  success: boolean;
  message: string;
};

function useCanvasRoom(canvasId: string) {
  useEffect(() => {
    if (!canvasId) return;

    const handleJoinCanvas = (response: JoinCanvasAck) => {
      if (!response.success) {
        toast.error("Failed to join canvas");
        return;
      }
      toast.success(response.message);
    };

    const handleUserJoin = ({ message }: { message: string }) => {
      toast(message);
    };

    const handleUserLeft = ({ message }: { message: string }) => {
      toast(message);
    };

    socket.emit("join-canvas", canvasId, handleJoinCanvas);

    socket.on("user-joined", handleUserJoin);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.emit("leave-canvas", canvasId);

      socket.off("user-joined", handleUserJoin);
      socket.off("user-left", handleUserLeft);
    };
  }, [canvasId]);

  return;
}

export default useCanvasRoom;
