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
          const currentIndex = prev.index;

          const newHistory = prev.history.slice(0, currentIndex + 1);

          const newState = [
            ...newHistory[newHistory.length - 1],
            ...deserializedStrokes,
          ];

          newHistory.push(newState);

          return {
            history: newHistory,
            index: currentIndex + 1,
          };
        });
      }

      if (response.eraseIds.length) {
        setState((prev) => {
          const currentIndex = prev.index;

          const newHistory = prev.history.slice(0, currentIndex + 1);

          const newState = [
            ...newHistory[newHistory.length - 1].filter((stroke) => {
              return !response.eraseIds.some((id) => id === stroke.id);
            }),
          ];

          newHistory.push(newState);

          return {
            history: newHistory,
            index: currentIndex + 1,
          };
        });
      }

      if (response.moveStrokes.length) {
        const deserializedStrokes = deserializeStrokes(response.moveStrokes);

        setState((prev) => {
          const currentIndex = prev.index;

          const newHistory = prev.history.slice(0, currentIndex + 1);

          const newState = [
            ...newHistory[newHistory.length - 1].filter(
              (stroke) => !deserializedStrokes.some((s) => stroke.id === s.id),
            ),
            ...deserializedStrokes,
          ];

          newHistory.push(newState);

          return {
            history: newHistory,
            index: currentIndex + 1,
          };
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
        const currentIndex = prev.index;

        const newHistory = prev.history.slice(0, currentIndex + 1);

        const newState = [
          ...newHistory[newHistory.length - 1],
          ...deserializedStrokes,
        ];

        newHistory.push(newState);

        return {
          history: newHistory,
          index: currentIndex + 1,
        };
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
        const currentIndex = prev.index;

        const newHistory = prev.history.slice(0, currentIndex + 1);

        const newState = [
          ...newHistory[newHistory.length - 1].filter((stroke) => {
            return !ids.some((id) => id === stroke.id);
          }),
        ];

        newHistory.push(newState);

        return {
          history: newHistory,
          index: currentIndex + 1,
        };
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
        const currentIndex = prev.index;

        const newHistory = prev.history.slice(0, currentIndex + 1);

        const newState = [
          ...newHistory[newHistory.length - 1].filter(
            (stroke) => !deserializedStrokes.some((s) => stroke.id === s.id),
          ),
          ...deserializedStrokes,
        ];

        newHistory.push(newState);

        return {
          history: newHistory,
          index: currentIndex + 1,
        };
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
      console.log(canvas.canManage);
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
