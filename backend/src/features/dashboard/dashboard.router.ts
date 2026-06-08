import { Router } from "express";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.get("/", dashboardController.getAllCanvases);

export default router;
