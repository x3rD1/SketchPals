import { Server, Socket } from "socket.io";
import { hasAccess } from "./canvas.service";
import { CanvasEventVars, SaveCanvasVars } from "../types";
import { updateCanvas } from "../../features/canvas/canvas.service";
import { CanvasOp } from "../../features/canvas/canvas.types";
import reorderOps from "../../utils/reorderOperations";

const roomState: Record<string, CanvasOp[]> = {};
const moveOp: CanvasOp = { type: "move", strokes: [] };

function registerCanvasHandlers(io: Server, socket: Socket) {
  const { id: userId, username } = socket.user;

  socket.on("join-canvas", async (canvasId, callback) => {
    try {
      // Checks whether the authenticated socket has access to canvasId
      await hasAccess(canvasId, userId);

      // Make the socket join the canvas
      socket.join(canvasId);

      // Notify everyone in the canvas that socket has joined
      socket.to(canvasId).emit("user-joined", {
        message: `${username} has joined the canvas`,
      });

      if (!roomState[canvasId]) {
        callback({
          success: true,
          message: "Joined canvas successfully",
          drawStrokes: [],
          eraseIds: [],
          moveStrokes: [],
        });
        return;
      }

      const room = roomState[canvasId];

      // Respond to the requester
      callback({
        success: true,
        message: "Joined canvas successfully",
        drawStrokes: room
          .filter((op) => op.type === "add")
          .flatMap((op) => op.strokes),
        eraseIds: room
          .filter((op) => op.type === "delete")
          .flatMap((op) => op.ids),
        moveStrokes: room
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

    const room = io.sockets.adapter.rooms.get(canvasId);

    if (!room || room.size === 0) {
      delete roomState[canvasId];
    }

    // Notify everyone in the canvas that socket left the canvas
    socket.to(canvasId).emit("user-left", {
      message: `${username} has left the canvas`,
    });
  });

  socket.on("canvas:draw", ({ canvasId, op }: CanvasEventVars) => {
    if (op.type !== "add") return;

    if (!roomState[canvasId]) {
      roomState[canvasId] = [];
      roomState[canvasId].push(moveOp);
    }
    roomState[canvasId].push(op);

    socket.to(canvasId).emit("canvas:draw", op.strokes);
  });

  socket.on("canvas:erase", ({ canvasId, op }: CanvasEventVars) => {
    if (op.type !== "delete") return;

    if (!roomState[canvasId]) {
      roomState[canvasId] = [];
      roomState[canvasId].push(moveOp);
    }
    roomState[canvasId].push(op);

    socket.to(canvasId).emit("canvas:erase", op.ids);
  });

  socket.on("canvas:move", ({ canvasId, op }: CanvasEventVars) => {
    if (op.type !== "move") return;

    if (!roomState[canvasId]) {
      roomState[canvasId] = [];
      roomState[canvasId].push(moveOp);
    }

    const opIds = new Set(op.strokes.map((stroke) => stroke.id));

    roomState[canvasId] = roomState[canvasId].map((roomOp) => {
      if (roomOp.type !== "move") return roomOp;

      const strokes = roomOp.strokes.filter((s) => !opIds.has(s.id));

      return {
        ...roomOp,
        strokes: [...strokes, ...op.strokes],
      };
    });

    socket.to(canvasId).emit("canvas:move", op.strokes);
  });

  socket.on(
    "canvas:save",
    async ({ canvasId, image: file, version }: SaveCanvasVars, callback) => {
      try {
        const canvasOps = roomState[canvasId];
        if (!canvasOps?.length) throw new Error("Nothing to save");

        const orderedOps = reorderOps(canvasOps);

        const buffer = Buffer.from(file);

        const data = {
          id: canvasId,
          ops: orderedOps,
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

        delete roomState[canvasId];

        callback({ success: true, data: canvas });
      } catch (error) {
        if (error instanceof Error)
          callback({ success: false, message: error.message, data: null });
      }
    },
  );

  return;
}

export default registerCanvasHandlers;
