import { Router } from "express";
import { availabilityController } from "./availability.controller";
import authMiddleware from "../../Middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware("TUTOR"),
  availabilityController.setAvailability,
);

export const availabilityRoute = router;
