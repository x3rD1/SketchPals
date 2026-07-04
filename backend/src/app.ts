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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
