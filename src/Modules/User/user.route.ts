import { Router } from "express";
import { userController } from "./user.controller";
import authMiddleware from "../../Middleware/authMiddleware";

const router = Router();

router.post("/tutor", authMiddleware(), userController.becomeTutor);
router.get("/", authMiddleware("ADMIN"), userController.getAllUsers);
router.patch(
  "/:id/status",
  authMiddleware("ADMIN"),
  userController.toggleUserStatus,
);

export const userRoute = router;
