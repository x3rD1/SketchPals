import { Router } from "express";
import * as canvasController from "./canvas.controller";

const router = Router();

router.get("/:id", canvasController.getCanvasById);
router.post("/", canvasController.createCanvas);

router.get("/:id/members", canvasController.getCanvasMembers);
router.post("/:id/members", canvasController.addCanvasMember);
router.delete("/:id/members/:userId", canvasController.removeCanvasMember);

export default router;
