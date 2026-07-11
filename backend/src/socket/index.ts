import { Server } from "socket.io";
import registerCanvasHandlers from "./canvas/canvas.socket";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("connected");

    registerCanvasHandlers(socket);

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
