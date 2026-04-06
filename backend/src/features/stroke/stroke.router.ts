import { Router } from "express";
import * as strokeController from "./stroke.controller";

const router = Router();

router.get("/", strokeController.getAllStrokes);
router.post("/", strokeController.createStroke);

export default router;
