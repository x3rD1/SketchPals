import { Server } from "socket.io";
import registerCanvasHandlers from "./canvas/canvas.socket";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("connected");

    registerCanvasHandlers(io, socket);
  });
};
