import { Router } from "express";
import { userController } from "./user.controller";
import authMiddleware from "../../Middleware/authMiddleware";

const router = Router();

router.post("/tutor", authMiddleware(), userController.becomeTutor);

export const userRoute = router;
