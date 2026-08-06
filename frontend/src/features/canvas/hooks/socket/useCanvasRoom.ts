import { useEffect } from "react";
import toast from "react-hot-toast";
import { socket } from "../../../../socket/socket";
import type {
  CanvasData,
  CanvasEngine,
  SerializedStroke,
} from "../../types/types";
import { deserializeStrokes } from "../../utils/strokeSerialization";
import { useQueryClient } from "@tanstack/react-query";
import appendStateToHistory from "../../utils/appendStateToHistory";
import createLiveCanvas from "../../utils/createLiveCanvas";

export type JoinCanvasAck = {
  success: boolean;
  message: string;
  persisted: SerializedStroke[];
  drawStrokes: SerializedStroke[];
  eraseIds: string[];
  moveStrokes: SerializedStroke[];
};

function useCanvasRoom(engine: CanvasEngine) {
  const { id: canvasId, setState } = engine;

  const queryClient = useQueryClient();

  // Join the user to the socket room
  useEffect(() => {
    const handleJoinCanvas = (response: JoinCanvasAck) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const liveCanvas = createLiveCanvas(response);

      // Hydrate local state with live canvas
      setState({ history: [liveCanvas], index: 0 });

      toast.success(response.message);
    };

    socket.emit("join-canvas", canvasId, handleJoinCanvas);

    return () => {
      socket.emit("leave-canvas", canvasId);
    };
  }, [canvasId, setState, queryClient]);

  // Notify the user when someone joins or leaves
  useEffect(() => {
    const handleUserJoin = ({ message }: { message: string }) => {
      toast(message);
    };

    const handleUserLeft = ({ message }: { message: string }) => {
      toast(message);
    };

    socket.on("user-joined", handleUserJoin);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoin);
      socket.off("user-left", handleUserLeft);
    };
  }, []);

  // Draw event
  useEffect(() => {
    const addStrokeToCanvas = (strokes: SerializedStroke[]) => {
      const deserializedStrokes = deserializeStrokes(strokes);

      setState((prev) => {
        return appendStateToHistory("add", prev, {
          newCanvasState: deserializedStrokes,
        });
      });
    };

    socket.on("canvas:draw", addStrokeToCanvas);

    return () => {
      socket.off("canvas:draw", addStrokeToCanvas);
    };
  }, [setState]);

  // Erase event
  useEffect(() => {
    const removeStrokeFromCanvas = (ids: string[]) => {
      setState((prev) => {
        return appendStateToHistory("delete", prev, { idsToRemove: ids });
      });
    };

    socket.on("canvas:erase", removeStrokeFromCanvas);

    return () => {
      socket.off("canvas:erase", removeStrokeFromCanvas);
    };
  }, [setState]);

  // Move event
  useEffect(() => {
    const moveStrokes = (strokes: SerializedStroke[]) => {
      const deserializedStrokes = deserializeStrokes(strokes);

      setState((prev) => {
        return appendStateToHistory("move", prev, {
          newCanvasState: deserializedStrokes,
        });
      });
    };

    socket.on("canvas:move", moveStrokes);

    return () => {
      socket.off("canvas:move", moveStrokes);
    };
  }, [setState]);

  // Save event
  useEffect(() => {
    const updateVersion = (canvas: CanvasData) => {
      queryClient.setQueryData(["canvas", canvasId], canvas);
    };

    socket.on("canvas:save", updateVersion);

    return () => {
      socket.off("canvas:save", updateVersion);
    };
  }, [canvasId, queryClient]);

  useEffect(() => {
    const handleError = (message: string) => {
      toast.error(message);
    };

    socket.on("canvas:error", handleError);

    return () => {
      socket.off("canvas:error", handleError);
    };
  });
  return;
}

export default useCanvasRoom;
