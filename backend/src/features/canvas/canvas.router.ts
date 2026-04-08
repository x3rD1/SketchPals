import { Router } from "express";
import * as canvasController from "./canvas.controller";

const router = Router();

router.get("/:id", canvasController.getCanvasById);
router.post("/", canvasController.createCanvas);
router.patch("/:id", canvasController.updateCanvas);

export default router;
