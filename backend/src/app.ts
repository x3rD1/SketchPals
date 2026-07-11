import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import canvasRouter from "./features/canvas/canvas.router";
import dashboardRouter from "./features/dashboard/dashboard.router";
import authRouter from "./features/auth/auth.router";
import userRouter from "./features/users/user.route";
import { requireAuth } from "./features/auth/requireAuth";

import { errorMiddleware } from "./middlewares/errorMiddleware";

import { Server } from "socket.io";
import { createServer } from "node:http";
import { registerSocketHandlers } from "./socket";
import authenticateSocket from "./socket/auth.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running!");
});

// Routes
app.use("/auth", authRouter);
app.use("/dashboard", requireAuth, dashboardRouter);
app.use("/canvas", requireAuth, canvasRouter);
app.use("/users", requireAuth, userRouter);

// Custom Errors
app.use(errorMiddleware);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

io.use(authenticateSocket);

registerSocketHandlers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
