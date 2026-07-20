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

type JoinCanvasAck = {
  success: boolean;
  message: string;
  drawStrokes: SerializedStroke[];
  eraseIds: string[];
  moveStrokes: SerializedStroke[];
};

function useCanvasRoom(engine: CanvasEngine) {
  const { id: canvasId, setState, hasHydrated } = engine;

  const didHydrate = hasHydrated.current;

  const queryClient = useQueryClient();

  // Join + User event
  useEffect(() => {
    if (!canvasId) return;
    if (!didHydrate) return;

    // Hydrate local state from room state on join
    const handleJoinCanvas = (response: JoinCanvasAck) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      if (response.drawStrokes.length) {
        const deserializedStrokes = deserializeStrokes(response.drawStrokes);

        setState((prev) => {
          return appendStateToHistory("add", prev, {
            newCanvasState: deserializedStrokes,
          });
        });
      }

      if (response.eraseIds.length) {
        setState((prev) => {
          return appendStateToHistory("delete", prev, {
            idsToRemove: response.eraseIds,
          });
        });
      }

      if (response.moveStrokes.length) {
        const deserializedStrokes = deserializeStrokes(response.moveStrokes);

        setState((prev) => {
          return appendStateToHistory("move", prev, {
            newCanvasState: deserializedStrokes,
          });
        });
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
  }, [canvasId, setState, didHydrate, queryClient]);

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
  return;
}

export default useCanvasRoom;
