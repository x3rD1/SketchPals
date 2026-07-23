import { Server, Socket } from "socket.io";
import { hasAccess } from "./canvas.service";
import { CanvasEventVars, SaveCanvasVars } from "../types";
import { updateCanvas } from "../../features/canvas/canvas.service";
import { CanvasOp } from "../../features/canvas/canvas.types";
import reorderOps from "../utils/reorderOperations";
import reduceOperations from "../utils/reduceOperations";
import {
  cancelRoomDeletion,
  scheduleRoomDeletion,
} from "../utils/scheduleRoomDeletion";
import getRoom from "../utils/getRoom";
import initializeRoom from "../utils/initializeRoom";

const roomState: Record<string, CanvasOp[]> = {};

function registerCanvasHandlers(io: Server, socket: Socket) {
  const { id: userId, username } = socket.user;

  socket.on("join-canvas", async (canvasId, callback) => {
    try {
      // Checks whether the authenticated socket has access to canvasId
      const canvas = await hasAccess(canvasId, userId);

      // Make the socket join the canvas
      socket.join(canvasId);

      socket.data.canvasId = canvasId;

      // Cancel pending room deletion timer
      cancelRoomDeletion(canvasId);

      // Notify everyone in the canvas that socket has joined
      socket.to(canvasId).emit("user-joined", {
        message: `${username} has joined the canvas`,
      });

      if (!roomState[canvasId]) {
        initializeRoom(roomState, canvasId);

        callback({
          success: true,
          message: "Joined canvas successfully",
          persisted: canvas.strokes,
          drawStrokes: [],
          eraseIds: [],
          moveStrokes: [],
        });
        return;
      }

      const room = getRoom(roomState, canvasId);
      const orderedRoomOps = reorderOps(room);
      const optimizedRoom = reduceOperations(orderedRoomOps);

      // Respond to the requester
      callback({
        success: true,
        message: "Joined canvas successfully",
        persisted: canvas.strokes,
        drawStrokes: optimizedRoom
          .filter((op) => op.type === "add")
          .flatMap((op) => op.strokes),
        eraseIds: optimizedRoom
          .filter((op) => op.type === "delete")
          .flatMap((op) => op.ids),
        moveStrokes: optimizedRoom
          .filter((op) => op.type === "move")
          .flatMap((op) => op.strokes),
      });
    } catch (error) {
      if (error instanceof Error)
        callback({ success: false, message: error.message });
    }
  });
  socket.on("leave-canvas", (canvasId) => {
    // Make the socket leave the canvas
    socket.leave(canvasId);

    scheduleRoomDeletion(io, roomState, canvasId);

    // Notify everyone in the canvas that socket left the canvas
    socket.to(canvasId).emit("user-left", {
      message: `${username} has left the canvas`,
    });
  });

  socket.on("canvas:draw", ({ canvasId, op }: CanvasEventVars) => {
    try {
      if (op.type !== "add") return;

      const room = getRoom(roomState, canvasId);

      room.push(op);

      socket.to(canvasId).emit("canvas:draw", op.strokes);
    } catch (error) {
      if (error instanceof Error) {
        socket.emit("canvas:error", error.message);
        console.error(error.message);
      }
    }
  });

  socket.on("canvas:erase", ({ canvasId, op }: CanvasEventVars) => {
    try {
      if (op.type !== "delete") return;

      const room = getRoom(roomState, canvasId);

      room.push(op);

      socket.to(canvasId).emit("canvas:erase", op.ids);
    } catch (error) {
      if (error instanceof Error) {
        socket.emit("canvas:error", error.message);
        console.error(error.message);
      }
    }
  });

  socket.on("canvas:move", ({ canvasId, op }: CanvasEventVars) => {
    try {
      if (op.type !== "move") return;

      let room = getRoom(roomState, canvasId);

      const opIds = new Set(op.strokes.map((stroke) => stroke.id));

      room = roomState[canvasId].map((roomOp) => {
        if (roomOp.type !== "move") return roomOp;

        const strokes = roomOp.strokes.filter((s) => !opIds.has(s.id));

        return {
          ...roomOp,
          strokes: [...strokes, ...op.strokes],
        };
      });

      socket.to(canvasId).emit("canvas:move", op.strokes);
    } catch (error) {
      if (error instanceof Error) {
        socket.emit("canvas:error", error.message);
        console.error(error.message);
      }
    }
  });

  socket.on(
    "canvas:save",
    async ({ canvasId, image: file, version }: SaveCanvasVars, callback) => {
      try {
        const canvasOps = roomState[canvasId];
        if (!canvasOps?.length) throw new Error("Nothing to save");

        const orderedOps = reorderOps(canvasOps);

        const optimizedOps = reduceOperations(orderedOps);

        if (!optimizedOps.length) {
          throw new Error("Nothing to save");
        }

        const buffer = Buffer.from(file);

        const data = {
          id: canvasId,
          ops: optimizedOps,
          version,
          buffer,
          userId,
        };

        const canvas = await updateCanvas(data);

        // TODO: fix issue where the owner of the canvas receives the canvas with canManage set to false
        if (canvas.canManage) {
          socket
            .to(canvasId)
            .emit("canvas:save", { ...canvas, canManage: false });
        }
        if (!canvas.canManage) {
          socket.to(canvasId).except(canvas.userId).emit("canvas:save", canvas);
          io.to(canvas.userId).emit("canvas:save", {
            ...canvas,
            canManage: true,
          });
        }

        // Reset the room on save
        initializeRoom(roomState, canvasId);

        callback({ success: true, data: canvas });
      } catch (error) {
        if (error instanceof Error)
          callback({ success: false, message: error.message, data: null });
      }
    },
  );

  socket.on("disconnect", () => {
    console.log("disconnected");

    const canvasId = socket.data.canvasId;

    if (!canvasId) return;

    scheduleRoomDeletion(io, roomState, canvasId);
  });
  return;
}

export default registerCanvasHandlers;
