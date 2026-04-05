import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.get("/strokes", async (req, res) => {
  try {
    const strokes = await prisma.stroke.findMany();

    res.json(strokes);
  } catch (error) {
    console.log(error);
  }
});

app.post("/strokes", async (req, res) => {
  try {
    const { points } = req.body;

    const stroke = await prisma.stroke.create({ data: { points } });

    res.json(stroke);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
