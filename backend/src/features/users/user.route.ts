import { Router } from "express";
import * as userController from "./user.controller";

const router = Router();

router.get("/search", userController.getUsers);

export default router;
