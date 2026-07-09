import { Server } from "socket.io";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("connected");

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
