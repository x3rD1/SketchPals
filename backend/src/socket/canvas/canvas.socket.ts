import { Socket } from "socket.io";
import { hasAccess } from "./canvas.service";

function registerCanvasHandlers(socket: Socket) {
  const { id, username } = socket.user;

  socket.on("join-canvas", async (canvasId, callback) => {
    try {
      await hasAccess(canvasId, id);

      // Make the socket join the canvas
      socket.join(canvasId);

      // Respond to the requester
      callback({ success: true, message: "Joined canvas successfully" });

      // Notify everyone in the canvas that socket has joined
      socket.to(canvasId).emit("user-joined", {
        message: `${username} has joined the canvas`,
      });
    } catch {
      callback({ success: false, message: "Unauthorized" });
    }
  });
  socket.on("leave-canvas", (canvasId) => {
    // Make the socket leave the canvas
    socket.leave(canvasId);

    // Notify everyone in the canvas that socket left the canvas
    socket.to(canvasId).emit("user-left", {
      message: `${username} has left the canvas`,
    });
  });

  return;
}

export default registerCanvasHandlers;
