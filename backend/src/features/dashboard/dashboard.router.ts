import { Router } from "express";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.get("/", dashboardController.getAllCanvases);
router.patch("/:id", dashboardController.updateCanvasTitle);

export default router;
