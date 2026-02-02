import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/tutor", userController.becomeTutor);

export const userRoute = router;
