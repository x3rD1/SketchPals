import express from "express";
import cors from "cors";

import canvasRouter from "./features/canvas/canvas.router";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running!");
});

// Routes
app.use("/canvas", canvasRouter);

// Custom Errors
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
