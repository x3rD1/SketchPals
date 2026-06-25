import { Router } from "express";
import * as canvasController from "./canvas.controller";
import { upload } from "../../config/multer";

const router = Router();

router.get("/:id", canvasController.getCanvasById);
router.post("/", canvasController.createCanvas);
router.patch("/:id", upload.single("image"), canvasController.updateCanvas);

export default router;
